/* APARTADO PARA LA CREACION DE LA BASE DE DATOS CON SU CREACION DE TABLAS */

const db = require('./db');

async function setupDatabase() {
  console.log('🏗️  Iniciando la configuración de la base de datos...');

  try {
    const createTablesQuery = `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- Necesario para generar UUIDs automáticamente

      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        full_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('Admin', 'Coordinador', 'Usuario')),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS rooms (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        location TEXT,
        capacity INTEGER NOT NULL,
        equipment TEXT[], -- Tipo array de texto, nativo de PostgreSQL
        image_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS reservations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Si se borra un usuario, se borran sus reservas
        room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE, -- Si se borra una sala, se borran sus reservas
        start_time TIMESTAMPTZ NOT NULL,
        end_time TIMESTAMPTZ NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('Pendiente', 'Aprobada', 'Rechazada', 'Cancelada')),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    await db.query(createTablesQuery);
    console.log('✅ ¡Tablas creadas exitosamente!');
  } catch (error) {
    console.error('❌ Error al configurar la base de datos:', error);
  } finally { 
    console.log('🏁 Configuración de la base de datos finalizada.');
  }
}

setupDatabase();