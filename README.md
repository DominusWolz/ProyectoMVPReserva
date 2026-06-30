# Sistema de Reservas de Mesas para Restaurantes

Aplicacion full-stack para gestionar reservas de mesas en restaurantes. Los clientes pueden registrarse, iniciar sesion, elegir servicio, mesa, fecha y horario disponible. El administrador gestiona servicios, mesas, horarios y revisa la agenda diaria.

## Stack tecnologico

- Frontend: Vanilla JS + Vite (`client/`)
- Backend: Node.js + Express
- Base de datos: MySQL
- ORM: Sequelize
- Autenticacion: bcryptjs + JWT

## Estructura

```text
PROYECTOMVPRESERVA/
├── client/                    # Frontend Vite SPA
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── migrations/                # Migraciones Sequelize
├── src/                       # Backend Express
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── database.js
│   ├── seed.js
│   └── index.js
├── config/
│   └── config.js              # Config Sequelize CLI desde .env
├── reservas_db.sql            # Script SQL directo opcional
├── .env.example
├── .sequelizerc
└── README.md
```

## Requisitos previos

- Node.js 18+
- MySQL Server activo
- Base de datos `reservas_db` creada, o permisos para crearla desde tu gestor MySQL

## Variables de entorno

1. Copia el ejemplo:

```bash
cp .env.example .env
```

2. Edita `.env` con tus datos locales:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=reservas_db
JWT_SECRET=un_secreto_largo_y_seguro
VITE_API_URL=http://localhost:3000/api
```

No subas `.env` a GitHub. El archivo `.env.example` no debe contener secretos reales.

## Instalacion

```bash
# Backend
npm install

# Frontend
cd client
npm install
cd ..
```

## Base de datos

Puedes usar una de estas opciones:

```bash
# Opcion A: ejecutar migraciones Sequelize
npm run migrate

# Opcion B: ejecutar reservas_db.sql desde MySQL Workbench/phpMyAdmin/consola
```

Para cargar datos demo:

```bash
npm run seed
```

El seed crea:

- Admin: `admin@restaurant.com` / `admin123`
- Cliente: `cliente@demo.com` / `admin123`

## Ejecucion local

Abre dos terminales:

```bash
# Terminal 1 - Backend
npm run dev
```

```bash
# Terminal 2 - Frontend
cd client
npm run dev
```

URLs locales:

- API: `http://localhost:3000/api`
- Health check: `http://localhost:3000/api/health`
- Frontend: `http://localhost:5173`

## Flujo sugerido de prueba

1. Ejecuta `npm run seed`.
2. Abre el frontend en `http://localhost:5173`.
3. Inicia sesion como admin.
4. Revisa o crea servicios, mesas y horarios.
5. Cierra sesion e inicia como cliente demo, o registra un cliente nuevo.
6. Crea una reserva eligiendo servicio, mesa, fecha y slot disponible.
7. Verifica la reserva en "Mis Reservas".
8. Intenta reservar el mismo slot con otro cliente: la API debe responder conflicto.
9. Cancela la reserva y confirma que el slot vuelve a aparecer.
10. Entra como admin y revisa "Agenda del Dia" y "Reservas por Fecha".

## Validaciones principales

- Registro con email valido, password minima y email unico.
- Login con JWT.
- Rutas protegidas con token y rol admin donde corresponde.
- Servicios con nombre, duracion positiva y precio no negativo.
- Mesas con numero/capacidad validos y numero unico.
- Horarios con dia valido, inicio menor que fin, intervalo valido y sin solaparse.
- Reservas solo en horarios configurados, no en el pasado y sin doble reserva en la misma mesa.
