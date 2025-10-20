/* -- Ingresa salas con datos quemados a la pagina web SI ES QUE NO EXISTEN SALAS YA GUARDADAS
EN LA BASE DE DATOS. Estos datos se plantaran de forma automatica -- */

const db = require('./db');

const roomsData = [
    {
        name: "Sala Ejecutiva A",
        floor: 5,
        wing: "Norte",
        capacity: 12,
        equipment: ["Pantalla", "Proyector", "Videollamada", "Pizarra", "Audio"],
        imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
    },
    {
        name: "Sala de Conferencias B",
        floor: 3,
        wing: "Sur",
        capacity: 20,
        equipment: ["Pantalla", "Proyector", "Videollamada", "Pizarra", "Audio"],
        imageUrl: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800",
    },
    {
        name: "Sala de Reuniones C",
        floor: 2,
        wing: "Este",
        capacity: 6,
        equipment: ["Pantalla", "Videollamada", "Pizarra"],
        imageUrl: "https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=800",
    },
    {
        name: "Sala de Innovación D",
        floor: 4,
        wing: "Oeste",
        capacity: 8,
        equipment: ["Pantalla", "Proyector", "Videollamada", "Pizarra"],
        imageUrl: "https://images.unsplash.com/photo-1631246957572-0c49e4ee6ff4?w=800",
    },
    {
        name: "Sala de Capacitación E",
        floor: 1,
        wing: "Norte",
        capacity: 30,
        equipment: ["Pantalla", "Proyector", "Pizarra", "Audio"],
        imageUrl: "https://images.unsplash.com/photo-1573167507387-6b4b98cb7c13?w=800",
    },
    {
        name: "Sala Privada F",
        floor: 3,
        wing: "Este",
        capacity: 4,
        equipment: ["Videollamada"],
        imageUrl: "https://images.unsplash.com/photo-1692133226337-55e513450a32?w=800",
    },
];

async function seedDatabase() {
    try {
        const existingRooms = await db.query('SELECT COUNT(*) FROM rooms');
        if (parseInt(existingRooms.rows[0].count) > 0) {
            console.log('🟡 La base de datos ya tiene salas. No se necesita siembra.');
            return;
        }
        for (const room of roomsData) {
            const query = `
                INSERT INTO rooms (name, location, capacity, equipment, image_url)
                VALUES ($1, $2, $3, $4, $5)`;
            const locationString = `Piso ${room.floor}, Ala ${room.wing}`;
            const values = [room.name, locationString, room.capacity, room.equipment, room.imageUrl];
            await db.query(query, values);
        }
        console.log('✅ ¡Siembra completada exitosamente!');
    } catch (error) {
        console.error('❌ Error durante la siembra:', error);
    } finally {
        console.log('🏁 Proceso de siembra finalizado.');
    }
}

seedDatabase();