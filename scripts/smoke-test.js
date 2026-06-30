process.env.NODE_ENV = 'test';

const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const app = require('../src/index');
const { sequelize, Usuario, Mesa, Servicio, Reserva, Disponibilidad } = require('../src/database');

const suffix = Date.now();
const password = 'admin123';
const created = {
  usuarios: [],
  mesas: [],
  servicios: [],
  reservas: [],
  disponibilidades: []
};

let baseUrl;
let server;

const pad = (value) => String(value).padStart(2, '0');

const fechaTexto = (fecha) => {
  return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}`;
};

const horaAMinutos = (hora) => {
  const [h, m] = String(hora).slice(0, 5).split(':').map(Number);
  return h * 60 + m;
};

const escuchar = () => new Promise((resolve) => {
  server = app.listen(0, () => {
    baseUrl = `http://127.0.0.1:${server.address().port}/api`;
    resolve();
  });
});

const cerrar = () => new Promise((resolve) => {
  if (!server) return resolve();
  server.close(resolve);
});

const request = async (path, options = {}) => {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  const res = await fetch(`${baseUrl}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    const error = new Error(data.error || `HTTP ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
};

const esperarError = async (status, accion, etiqueta) => {
  try {
    await accion();
  } catch (error) {
    if (error.status === status) return;
    throw new Error(`${etiqueta}: se esperaba ${status}, se obtuvo ${error.status || error.message}`);
  }

  throw new Error(`${etiqueta}: la operacion debio fallar con ${status}`);
};

const buscarFechaConDisponibilidad = async () => {
  for (let offset = 1; offset <= 14; offset += 1) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + offset);
    fecha.setHours(0, 0, 0, 0);

    const dia = fecha.getDay() + 1;
    const disponibilidades = await Disponibilidad.findAll({
      where: { dia_semana: dia },
      order: [['hora_inicio', 'ASC']]
    });

    const valida = disponibilidades.find((disp) => horaAMinutos(disp.hora_fin) - horaAMinutos(disp.hora_inicio) >= 30);
    if (valida) return fecha;

    if (disponibilidades.length === 0) {
      return fecha;
    }
  }

  throw new Error('No se encontro un dia disponible para probar reservas');
};

const cleanup = async () => {
  if (created.reservas.length) await Reserva.destroy({ where: { id: { [Op.in]: created.reservas } } });
  if (created.servicios.length) await Servicio.destroy({ where: { id: { [Op.in]: created.servicios } } });
  if (created.mesas.length) await Mesa.destroy({ where: { id: { [Op.in]: created.mesas } } });
  if (created.disponibilidades.length) await Disponibilidad.destroy({ where: { id: { [Op.in]: created.disponibilidades } } });
  if (created.usuarios.length) await Usuario.destroy({ where: { id: { [Op.in]: created.usuarios } } });
};

const main = async () => {
  await sequelize.sync();
  await escuchar();

  const adminEmail = `smoke.admin.${suffix}@example.com`;
  const clienteDosEmail = `smoke.cliente2.${suffix}@example.com`;
  const hash = await bcrypt.hash(password, 10);

  const admin = await Usuario.create({
    nombre: 'Smoke Admin',
    email: adminEmail,
    password: hash,
    rol: 'admin'
  });
  created.usuarios.push(admin.id);

  const adminLogin = await request('/auth/login', {
    method: 'POST',
    body: { email: adminEmail, password }
  });

  await esperarError(400, () => request('/auth/register', {
    method: 'POST',
    body: { nombre: 'Sin Password', email: `bad.${suffix}@example.com`, password: '123' }
  }), 'registro invalido');

  const cliente = await request('/auth/register', {
    method: 'POST',
    body: { nombre: 'Smoke Cliente', email: `smoke.cliente.${suffix}@example.com`, password }
  });
  created.usuarios.push(cliente.usuario.id);

  const clienteDos = await request('/auth/register', {
    method: 'POST',
    body: { nombre: 'Smoke Cliente Dos', email: clienteDosEmail, password }
  });
  created.usuarios.push(clienteDos.usuario.id);

  await esperarError(401, () => request('/auth/perfil'), 'ruta protegida sin token');

  const servicio = await request('/servicios', {
    method: 'POST',
    token: adminLogin.token,
    body: { nombre: `Smoke Servicio ${suffix}`, duracion: 30, precio: 1000 }
  });
  created.servicios.push(servicio.id);

  const mesa = await request('/mesas', {
    method: 'POST',
    token: adminLogin.token,
    body: { numero: 900000 + (suffix % 100000), capacidad: 2 }
  });
  created.mesas.push(mesa.id);

  const fechaReserva = await buscarFechaConDisponibilidad();
  const fechaReservaTexto = fechaTexto(fechaReserva);
  const diaSemana = fechaReserva.getDay() + 1;
  const dispsDia = await Disponibilidad.findAll({ where: { dia_semana: diaSemana } });

  if (dispsDia.length === 0) {
    const disponibilidad = await request('/disponibilidades', {
      method: 'POST',
      token: adminLogin.token,
      body: { dia_semana: diaSemana, hora_inicio: '09:00', hora_fin: '18:00', intervalo_min: 60 }
    });
    created.disponibilidades.push(disponibilidad.id);
  }

  const slotsAntes = await request(`/reservas/slots?fecha=${fechaReservaTexto}&mesa_id=${mesa.id}&servicio_id=${servicio.id}`, {
    token: cliente.token
  });

  if (!slotsAntes.slots.length) {
    throw new Error('No se generaron slots disponibles para la reserva de prueba');
  }

  const slot = slotsAntes.slots[0];
  const fechaHora = `${fechaReservaTexto}T${slot}`;

  const reserva = await request('/reservas', {
    method: 'POST',
    token: cliente.token,
    body: { mesa_id: mesa.id, servicio_id: servicio.id, fecha_hora: fechaHora }
  });
  created.reservas.push(reserva.id);

  await esperarError(409, () => request('/reservas', {
    method: 'POST',
    token: clienteDos.token,
    body: { mesa_id: mesa.id, servicio_id: servicio.id, fecha_hora: fechaHora }
  }), 'doble reserva');

  await esperarError(400, () => request('/reservas', {
    method: 'POST',
    token: clienteDos.token,
    body: { mesa_id: mesa.id, servicio_id: servicio.id, fecha_hora: `${fechaReservaTexto}T00:00` }
  }), 'reserva fuera de horario');

  const agenda = await request(`/reservas/agenda?fecha=${fechaReservaTexto}`, {
    token: adminLogin.token
  });
  if (!agenda.some((item) => item.id === reserva.id)) {
    throw new Error('La reserva no aparecio en agenda del dia');
  }

  await request(`/reservas/${reserva.id}/cancelar`, {
    method: 'PATCH',
    token: cliente.token
  });

  const slotsDespues = await request(`/reservas/slots?fecha=${fechaReservaTexto}&mesa_id=${mesa.id}&servicio_id=${servicio.id}`, {
    token: cliente.token
  });
  if (!slotsDespues.slots.includes(slot)) {
    throw new Error('El slot cancelado no volvio a estar disponible');
  }

  console.log('SMOKE_OK flujo completo validado');
};

main()
  .catch((error) => {
    console.error('SMOKE_ERROR:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await cleanup().catch((error) => {
      console.error('SMOKE_CLEANUP_ERROR:', error.message);
      process.exitCode = 1;
    });
    await cerrar();
    await sequelize.close();
  });
