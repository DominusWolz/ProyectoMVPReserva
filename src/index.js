require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./database');

const authRoutes = require('./routes/auth.routes');
const servicioRoutes = require('./routes/servicio.routes');
const mesaRoutes = require('./routes/mesa.routes');
const reservaRoutes = require('./routes/reserva.routes');
const disponibilidadRoutes = require('./routes/disponibilidad.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/mesas', mesaRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/disponibilidades', disponibilidadRoutes);

app.get('/api/health', (req, res) => {
  res.json({ estado: 'ok', servicio: 'API Reservas' });
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  sequelize.sync()
    .then(() => {
      app.listen(PORT, () => {
        console.log('Servidor backend corriendo en http://localhost:' + PORT);
      });
    })
    .catch(err => {
      console.error('Error al sincronizar base de datos:', err.message);
    });
}

module.exports = app;