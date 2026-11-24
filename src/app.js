require('dotenv').config();
const path = require('path');
const fastify = require('fastify')({ logger: true });
const { pool, dbConfig } = require('./config/db');

// Registrar plugins base (CORS y archivos estáticos de la carpeta public/)
fastify.register(require('@fastify/cors'));
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, '..', 'public'),
  prefix: '/',
});

// Endpoint de SOLO CONSULTA (GET): Obtiene la lista de bases de datos del servidor
fastify.get('/api/databases', async (request, reply) => {
  try {
    const [rows] = await pool.query('SHOW DATABASES');
    const databases = rows.map((fila) => Object.values(fila)[0]);

    return {
      ok: true,
      mensaje: 'Conectado correctamente a la base de datos (Modo Solo Consulta)',
      servidor: dbConfig.host,
      puerto: dbConfig.port,
      usuario: dbConfig.user,
      total: databases.length,
      databases,
    };
  } catch (error) {
    reply.code(500);
    return {
      ok: false,
      mensaje: 'No se pudo conectar a la base de datos',
      servidor: dbConfig.host,
      puerto: dbConfig.port,
      usuario: dbConfig.user,
      error: error.message,
      codigo: error.code,
    };
  }
});

// Función que arranca el servidor web y realiza la consulta inicial en consola
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  // Consulta automática al encender el servidor para mostrar las BDs en la terminal
  try {
    const [rows] = await pool.query('SHOW DATABASES');
    const databases = rows.map((fila) => Object.values(fila)[0]);
    console.log('\n============================================================');
    console.log(`CONEXION EXITOSA A MARIADB (${dbConfig.host}:${dbConfig.port} - Usuario: ${dbConfig.user})`);
    console.log(`Bases de datos encontradas (${databases.length}):`);
    databases.forEach((dbName, index) => {
      console.log(`   ${index + 1}. ${dbName}`);
    });
    console.log('============================================================\n');
  } catch (dbErr) {
    console.error('\n============================================================');
    console.error(`ERROR DE CONEXION A MARIADB (${dbConfig.host}:${dbConfig.port}): ${dbErr.message}`);
    console.error('============================================================\n');
  }
};

start();
