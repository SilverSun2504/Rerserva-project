const db = require('./db');

async function setupDatabase() {

  try {
    const createTablesQuery = `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- 1. Creamos la nueva tabla 'areas'
      CREATE TABLE IF NOT EXISTS areas (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL UNIQUE
      );

      -- 2. Modificamos la tabla 'users' para añadir la llave foránea
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        full_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('Admin', 'Coordinador', 'Usuario')),
        area_id UUID REFERENCES areas(id), 
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS rooms (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        location TEXT,
        capacity INTEGER NOT NULL,
        equipment TEXT[], -- Mantenemos esto simple por ahora
        image_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS reservations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
        start_time TIMESTAMPTZ NOT NULL,
        end_time TIMESTAMPTZ NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('Pendiente', 'Aprobada', 'Rechazada', 'Cancelada')),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await db.query(createTablesQuery);
    console.log('¡Tablas (incluyendo areas) creadas exitosamente!');
  } catch (error) {
    console.error('Error al configurar la base de datos:', error);
  } finally {
    console.log('Configuración de la base de datos finalizada.');
  }
}

setupDatabase();