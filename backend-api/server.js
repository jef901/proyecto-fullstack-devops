const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Configuración de la conexión a PostgreSQL usando variables de entorno
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password123',
  database: process.env.DB_NAME || 'devops_db',
  port: 5432,
});

// Función para crear la tabla si no existe al arrancar
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tareas (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        completada BOOLEAN DEFAULT false
      );
    `);
    
    // Insertar datos semilla solo si la tabla está vacía
    const res = await pool.query('SELECT COUNT(*) FROM tareas');
    if (parseInt(res.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO tareas (titulo, completada) VALUES 
        ('Instalar AWS CLI y Terraform', true),
        ('Configurar S3 y GitHub Actions', true),
        ('Dockerizar el Backend en Node.js', true),
        ('Persistir datos con PostgreSQL y Volumes', false);
      `);
    }
    console.log("Base de datos inicializada correctamente.");
  } catch (err) {
    console.error("Error inicializando la base de datos:", err);
  }
};

initDB();

// Ruta principal
app.get('/', (req, res) => {
  res.json({ mensaje: "API de DevOps con PostgreSQL activa!" });
});

// Obtener tareas desde la base de datos real
app.get('/api/tareas', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM tareas ORDER BY id ASC');
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener tareas" });
  }
});

// Crear una nueva tarea en la base de datos real
app.post('/api/tareas', async (req, res) => {
  const { titulo } = req.body;
  if (!titulo) {
    return res.status(400).json({ error: "El título es obligatorio" });
  }

  try {
    const nuevoRegistro = await pool.query(
      'INSERT INTO tareas (titulo, completada) VALUES ($1, false) RETURNING *',
      [titulo]
    );
    res.status(201).json(nuevoRegistro.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar la tarea" });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
