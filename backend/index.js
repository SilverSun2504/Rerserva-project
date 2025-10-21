/* ENDPOINTS PARA EL FUNCIONAMIENTO DE LA BASE DE DATOS CON POSTMAN */

const express = require('express');
const db = require('./db');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3001;
const cors = require('cors');

app.use(cors());
app.use(express.json());

// --- ENDPOINT DE ESTADÍSTICAS DEL DASHBOARD ---
// Endpoint para OBTENER las estadísticas de reservas (Pendientes, Aprobadas, Rechazadas)
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const query = `
      SELECT status, COUNT(*) as count
      FROM reservations
      WHERE status IN ('Pendiente', 'Aprobada', 'Rechazada')
      GROUP BY status;
    `;
    const result = await db.query(query);
    const stats = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };
    result.rows.forEach(row => {
      if (row.status === 'Pendiente') stats.pending = parseInt(row.count);
      if (row.status === 'Aprobada') stats.approved = parseInt(row.count);
      if (row.status === 'Rechazada') stats.rejected = parseInt(row.count);
    });
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// --- ENDPOINTS DE AUTENTICACIÓN ---
// Endpoint para registrar un nuevo usuario (ahora con area_id)
app.post('/api/auth/register', async (req, res) => {
    const { fullName, email, password, area_id } = req.body;
    if (!fullName || !email || !password || !area_id) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }
    const role = email.endsWith('@admin.com') ? 'Admin' : 'Usuario';
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const query = 'INSERT INTO users (full_name, email, password_hash, role, area_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, role';
        const values = [fullName, email, passwordHash, role, area_id];

        const result = await db.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Endpoint para iniciar sesión (ahora devuelve el nombre del área)
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'El email y la contraseña son obligatorios.' });
    }
    try {
        const query = `
      SELECT 
        u.id, 
        u.full_name, 
        u.email, 
        u.role, 
        u.password_hash, 
        u.area_id,
        a.name as area_name
      FROM users u
      LEFT JOIN areas a ON u.area_id = a.id
      WHERE u.email = $1
    `;
        const result = await db.query(query, [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }
        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }
        res.status(200).json({
            id: user.id,
            fullName: user.full_name,
            email: user.email,
            role: user.role,
            area_id: user.area_id,
            area_name: user.area_name,
        });
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// --- ENDPOINTS DE SALAS ---
// Endpoint para obtener todas las salas
app.get('/api/rooms', async (req, res) => {
    try {
        const result = await db.query('SELECT id, name, location, capacity, equipment, image_url FROM rooms ORDER BY name ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener las salas:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Endpoint para crear una nueva sala
app.post('/api/rooms', async (req, res) => {
    const { name, location, capacity, equipment, imageUrl } = req.body;
    if (!name || !capacity) {
        return res.status(400).json({ error: 'El nombre y la capacidad son obligatorios.' });
    }
    try {
        const query = `
      INSERT INTO rooms (name, location, capacity, equipment, image_url) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`;
        const values = [name, location, capacity, equipment, imageUrl];
        const result = await db.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear la sala:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Endpoint para obtener una sala por su ID
app.get('/api/rooms/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM rooms WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Sala no encontrada.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener la sala:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// --- ENDPOINTS DE RESERVAS ---
// Endpoint para CREAR una nueva reserva (CON VALIDACIÓN)
app.post('/api/reservations', async (req, res) => {
    const { userId, roomId, startTime, endTime } = req.body;
    if (!userId || !roomId || !startTime || !endTime) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();
    if (start < now) {
        return res.status(400).json({ error: 'No se pueden crear reservas en fechas o horas pasadas.' });
    }
    const startHour = start.getHours();
    const endHour = end.getHours();
    const endMinutes = end.getMinutes();
    if (startHour < 8 || startHour >= 18 || endHour < 8 || endHour > 18 || (endHour === 18 && endMinutes > 0)) {
        return res.status(400).json({ error: 'La reserva debe estar dentro del horario laboral (8:00 - 18:00).' });
    }
    if (start >= end) {
        return res.status(400).json({ error: 'La hora de finalización debe ser posterior a la de inicio.' });
    }
    try {
        const conflictQuery = `
      SELECT * FROM reservations
      WHERE room_id = $1
      AND status IN ('Aprobada', 'Pendiente')
      AND (start_time < $3 AND end_time > $2) -- Lógica de superposición
    `;
        const conflictResult = await db.query(conflictQuery, [roomId, startTime, endTime]);
        if (conflictResult.rows.length > 0) {
            return res.status(409).json({ error: 'Conflicto de horario. La sala ya está reservada o pendiente en ese horario.' });
        }
        const query = `
      INSERT INTO reservations (user_id, room_id, start_time, end_time, status)
      VALUES ($1, $2, $3, $4, 'Pendiente')
      RETURNING *
    `;
        const values = [userId, roomId, startTime, endTime];
        const result = await db.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear la reserva:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Endpoint para ACTUALIZAR el estado de una reserva (Aprobar/Rechazar)
app.put('/api/reservations/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 
    if (!status) {
        return res.status(400).json({ error: 'El nuevo estado es obligatorio.' });
    }
    if (status === 'Rechazada') {
        try {
            const result = await db.query('UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
            return res.status(200).json(result.rows[0]);
        } catch (error) {
            return res.status(500).json({ error: 'Error al rechazar la reserva.' });
        }
    }
    if (status === 'Aprobada') {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');
            const approveQuery = 'UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *';
            const approvedResult = await client.query(approveQuery, [status, id]);
            if (approvedResult.rows.length === 0) {
                throw new Error('Reserva no encontrada.');
            }
            const { room_id, start_time, end_time } = approvedResult.rows[0];
            const conflictQuery = `
        SELECT id FROM reservations
        WHERE id != $1
        AND room_id = $2
        AND status = 'Pendiente'
        AND (start_time < $4 AND end_time > $3) -- Lógica de superposición
      `;
            const conflictResult = await client.query(conflictQuery, [id, room_id, start_time, end_time]);
            if (conflictResult.rows.length > 0) {
                const conflictingIds = conflictResult.rows.map(r => r.id);
                const rejectQuery = `
          UPDATE reservations
          SET status = 'Rechazada'
          WHERE id = ANY($1::uuid[])
        `;
                await client.query(rejectQuery, [conflictingIds]);
            }
            await client.query('COMMIT');
            res.status(200).json(approvedResult.rows[0]);
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error en la transacción de aprobación:', error);
            res.status(500).json({ error: 'Error al aprobar la reserva y manejar conflictos.' });
        } finally {
            client.release();
        }
    }
});

app.get('/api/reservations/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const query = `
      SELECT 
        r.id,
        r.start_time,
        r.end_time,
        r.status,
        rm.name as room_name,
        rm.image_url
      FROM reservations r
      JOIN rooms rm ON r.room_id = rm.id
      WHERE r.user_id = $1
      ORDER BY r.start_time DESC
    `;
        const result = await db.query(query, [userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener las reservas del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// --- ENDPOINT DE ÁREAS ---
// Endpoint para obtener todas las áreas
app.get('/api/areas', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM areas ORDER BY name ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener las áreas:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// --- ENDPOINTS DE COORDINADOR ---
// Endpoint para OBTENER todas las reservas 'Pendientes' de un ÁREA específica
app.get('/api/reservations/pending/area/:areaId', async (req, res) => {
    const { areaId } = req.params;
    try {
        const query = `
      SELECT 
        r.id, r.start_time, r.end_time, r.status, r.created_at,
        u.full_name as user_name,
        rm.name as room_name
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      JOIN rooms rm ON r.room_id = rm.id
      WHERE u.area_id = $1 AND r.status = 'Pendiente'
      ORDER BY r.created_at ASC; -- Importante: orden cronológico
    `;
        const result = await db.query(query, [areaId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener las reservas pendientes del área:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// --- ENDPOINT DE USUARIOS (PARA FILTROS) ---
// Endpoint para OBTENER todos los usuarios (simplificado)
app.get('/api/users', async (req, res) => {
  try {
    const query = 'SELECT id, full_name FROM users ORDER BY full_name ASC';
    const result = await db.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// --- ENDPOINT DE REPORTES ---
// Endpoint para OBTENER reportes de reservas con filtros
app.get('/api/reports/reservations', async (req, res) => {
  const { roomId, userId, startDate, endDate } = req.query;
  let baseQuery = `
    SELECT 
      r.id, r.start_time, r.end_time, r.status, r.created_at,
      u.full_name as user_name,
      rm.name as room_name,
      a.name as area_name
    FROM reservations r
    JOIN users u ON r.user_id = u.id
    JOIN rooms rm ON r.room_id = rm.id
    LEFT JOIN areas a ON u.area_id = a.id
  `;
  const whereClauses = [];
  const queryParams = [];
  let paramIndex = 1;
  if (roomId) {
    whereClauses.push(`r.room_id = $${paramIndex++}`);
    queryParams.push(roomId);
  }
  if (userId) {
    whereClauses.push(`r.user_id = $${paramIndex++}`);
    queryParams.push(userId);
  }
  if (startDate) {
    whereClauses.push(`r.start_time >= $${paramIndex++}`);
    queryParams.push(startDate);
  }
  if (endDate) {
    const nextDay = new Date(endDate);
    nextDay.setDate(nextDay.getDate() + 1);
    whereClauses.push(`r.end_time <= $${paramIndex++}`);
    queryParams.push(nextDay.toISOString().split('T')[0]);
  }
  if (whereClauses.length > 0) {
    baseQuery += ' WHERE ' + whereClauses.join(' AND ');
  }
  baseQuery += ' ORDER BY r.start_time DESC';
  try {
    const result = await db.query(baseQuery, queryParams);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al generar el reporte:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// --- ENDPOINT PARA DASHBOARD: PRÓXIMAS RESERVAS ---
app.get('/api/reservations/upcoming/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const query = `
      SELECT 
        r.id,
        r.start_time,
        r.end_time,
        rm.name as room_name
      FROM reservations r
      JOIN rooms rm ON r.room_id = rm.id
      WHERE r.user_id = $1 
        AND r.status = 'Aprobada'     -- Solo aprobadas
        AND r.start_time > NOW()    -- Solo futuras (después de ahora)
      ORDER BY r.start_time ASC     -- La más cercana primero
      LIMIT 3;                      -- Mostramos solo las próximas 3 (puedes ajustar)
    `;
    const result = await db.query(query, [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener las próximas reservas:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});