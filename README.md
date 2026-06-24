# ProyectoMVPReserva
Proyecto Final de WEB, Relacionado a Reservas

# Sistema de Reservas de Mesas para Restaurantes

Este proyecto consiste en un sistema full-stack diseñado para la gestión y reserva de mesas en tiempo real. Permite a los clientes seleccionar mesas disponibles y horarios, facilitando la administración del local.

## Stack Tecnológico

* **Frontend:** Vanilla JS con Vite (Ubicado en la carpeta `client/`)
* **Backend:** Node.js con Express
* **Base de Datos:** MySQL
* **Despliegue:** Railway

---

## Estructura del Proyecto

```text
PROYECTOMVPRESERVA/
├── client/                 # Código fuente del Frontend
├── src/                    # Código fuente de la API (Backend)
├── .env.example            # Plantilla de variables de entorno sin secretos
├── .gitignore              # Archivos y carpetas excluidos de Git (incluye .env)
└── README.md               # Documentación general del proyecto

## Requisitos Previos

Antes de iniciar la instalación, asegúrate de tener instalado:

Node.js (Versión 18 o superior)

MySQL Server activo localmente

Instalación y Configuración Local
Sigue estos pasos para levantar el proyecto en tu máquina local:

1. Clonar el repositorio y configurar variables de entorno
Primero, clona el proyecto y entra a la carpeta principal:

Bash
git clone <URL_DE_TU_REPO>
cd PROYECTOMVPRESERVA
Configuración de variables de entorno:
Para configurar el entorno sin exponer credenciales en el repositorio, debes copiar el archivo de ejemplo. Ejecuta el siguiente comando para copiar .env.example a .env:

Bash
cp .env.example .env
(Si estás en Windows y el comando cp no te funciona, puedes simplemente copiar y pegar el archivo manualmente y renombrar la copia a .env).

Luego, abre tu nuevo archivo .env y reemplaza los valores de ejemplo por tus credenciales reales de tu base de datos local.

2. Instalar dependencias
Instala las dependencias necesarias para el Backend (en la raíz) y luego para el Frontend (en la carpeta client):

Bash
# Instalar dependencias del backend
npm install

# Instalar dependencias del frontend
cd client
npm install
Ejecución del Proyecto
Para poder probar el sistema, necesitas levantar tanto el servidor de la API como el servidor del cliente web en terminales separadas.

Levantar el Backend (API)
Abre una terminal en la raíz del proyecto (PROYECTOMVPRESERVA) y ejecuta:

Bash
npm run dev
La API estará funcionando en http://localhost:3000.

Levantar el Frontend (Web)
Abre una segunda terminal, ingresa a la carpeta del cliente y ejecuta:

Bash
cd client
npm run dev
El frontend levantará en la URL local que te indique la terminal (por defecto suele ser http://localhost:5173).