const bcrypt = require('bcryptjs');
const { sequelize, Usuario, Mesa, Servicio, Disponibilidad } = require('./database');

async function seed() {
  try {
    await sequelize.sync({ force: true });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin123', salt);

    await Usuario.create({ nombre: 'Admin', email: 'admin@restaurant.com', password: hash, rol: 'admin' });
    await Usuario.create({ nombre: 'Cliente Demo', email: 'cliente@demo.com', password: hash, rol: 'cliente' });

    await Mesa.create({ numero: 1, capacidad: 2 });
    await Mesa.create({ numero: 2, capacidad: 4 });
    await Mesa.create({ numero: 3, capacidad: 4 });
    await Mesa.create({ numero: 4, capacidad: 6 });
    await Mesa.create({ numero: 5, capacidad: 8 });

    await Servicio.create({ nombre: 'Mesa Estandar', duracion: 120, precio: 0 });
    await Servicio.create({ nombre: 'Cena de Aniversario', duracion: 180, precio: 15000 });
    await Servicio.create({ nombre: 'Salon Privado VIP', duracion: 240, precio: 50000 });

    for (let dia = 2; dia <= 7; dia++) {
      await Disponibilidad.create({ dia_semana: dia, hora_inicio: '09:00', hora_fin: '18:00', intervalo_min: 60 });
    }

    console.log('Base de datos seedada exitosamente');
    console.log('Admin: admin@restaurant.com / admin123');
    console.log('Cliente: cliente@demo.com / admin123');
  } catch (err) {
    console.error('Error al seedar:', err.message);
  }
  process.exit(0);
}

seed();
