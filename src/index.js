require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Permite que el cliente web consulte a la API
const servicioRoutes = require('./routes/servicio.routes.js');

const app = express();

// Middlewares base
app.use(cors());
app.use(express.json());

// Conexión de rutas
app.use('/api/servicios', servicioRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});