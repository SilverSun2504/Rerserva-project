/* ENDPOINTS PARA EL FUNCIONAMIENTO DE LA BASE DE DATOS CON POSTMAN */

const express = require('express');
const db = require('./db');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3001;
const cors = require('cors');

app.use(cors()); 
app.use(express.json());

// --- ENDPOINTS DE AUTENTICACIÓN ---
// Endpoint para registrar un nuevo usuario
app.post('/api/auth/register', async (req, res) => {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const query = 'INSERT INTO users (full_name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, email, role';
        const values = [fullName, email, passwordHash, role];
        const result = await db.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Endpoint para iniciar sesión
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'El email y la contraseña son obligatorios.' });
    }

    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

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

// Iniciamos el servidor en el puerto definido
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});