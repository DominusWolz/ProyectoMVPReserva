# Sistema de Reservas de Mesas para Restaurantes

Sistema full-stack para gestionar reservas de mesas en restaurantes. Los clientes pueden reservar servicios (cena estándar, aniversario, salón VIP) eligiendo mesa, fecha y hora disponible. El administrador gestiona servicios, mesas, horarios y visualiza la agenda del día.

## Stack Tecnológico

* **Frontend:** Vanilla JS + Vite (`client/`)
* **Backend:** Node.js + Express
* **Base de Datos:** MySQL
* **ORM:** Sequelize
* **Autenticación:** bcryptjs + JWT

---

## Estructura del Proyecto

```text
PROYECTOMVPRESERVA/
├── client/                    # Frontend (Vite SPA)
│   ├── index.html             # Aplicación completa (SPA)
│   ├── vite.config.js
│   └── package.json
├── migrations/                # Migraciones Sequelize
│   ├── 01-create-usuarios.js
│   ├── 02-create-mesas.js
│   ├── 03-create-servicios.js
│   ├── 04-create-reservas.js
│   └── 05-create-disponibilidades.js
├── src/                       # Backend (Express)
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── servicio.controller.js
│   │   ├── mesa.controller.js
│   │   ├── reserva.controller.js
│   │   └── disponibilidad.controller.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── Usuario.js
│   │   ├── Mesa.js
│   │   ├── Servicio.js
│   │   ├── Reserva.js
│   │   └── Disponibilidad.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── servicio.routes.js
│   │   ├── mesa.routes.js
│   │   ├── reserva.routes.js
│   │   └── disponibilidad.routes.js
│   ├── database.js            # Conexión Sequelize + asociaciones
│   ├── seed.js                # Datos de prueba
│   └── index.js               # Punto de entrada
├── config/
│   └── config.json            # Config Sequelize CLI
├── reservas_db.sql            # Script SQL directo
├── .env.example
├── .gitignore
└── README.md
```



## Requisitos Previos

- Node.js v18+
- MySQL Server activo

## Instalación

```bash
# 1. Clonar y entrar
git clone <URL_DEL_REPO>
cd PROYECTOMVPRESERVA

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales MySQL

# 3. Crear base de datos
# Opción A: Ejecutar reservas_db.sql en tu gestor MySQL
# Opción B: npm run migrate (requiere Sequelize CLI)

# 4. Instalar dependencias del backend
npm install

# 5. Instalar dependencias del frontend
cd client
npm install
cd ..

# 6. Seed (crea datos de prueba)
npm run seed
#   Admin: admin@restaurant.com / admin123
#   Cliente: cliente@demo.com / admin123
```

## Ejecución

```bash
# Terminal 1 - Backend (http://localhost:3000)
npm run dev

# Terminal 2 - Frontend (http://localhost:5173)
cd client
npm run dev
```



