const db = require('./db');

const areasData = [
    'Tecnología',
    'Marketing',
    'Recursos Humanos',
    'Gerencia',
    'Ventas',
    'Operaciones',
];

async function seedAreas() {
    console.log('🌱 Iniciando siembra de áreas...');
    try {
        const { rows } = await db.query('SELECT COUNT(*) FROM areas');
        if (parseInt(rows[0].count) > 0) {
            console.log('🟡 La tabla de áreas ya tiene datos.');
            return;
        }
        console.log('Insertando áreas...');
        for (const areaName of areasData) {
            await db.query('INSERT INTO areas (name) VALUES ($1)', [areaName]);
        }
        console.log('¡Siembra de áreas completada!');
    } catch (error) {
        console.error('Error durante la siembra de áreas:', error);
    } finally {
        console.log('Proceso de siembra de áreas finalizado.');
    }
}

seedAreas();