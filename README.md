# Sistema de Reservas de Mesas para Restaurantes

Este proyecto consiste en un sistema full-stack diseñado para la gestión y reserva de mesas en tiempo real. Permite a los clientes seleccionar mesas disponibles y horarios, facilitando la administración del local.

## Stack Tecnológico

* **Frontend:** Vanilla JS con Vite (Carpeta `client/`)
* **Backend:** Node.js con Express
* **Base de Datos:** MySQL
* **ORM y Modelado:** Sequelize
* **Despliegue:** Railway

---

## Estructura del Proyecto

```text
PROYECTOMVPRESERVA/
├── client/                 # Código fuente del Frontend
├── migrations/             # Scripts de migración de la base de datos (Sequelize)
├── src/                    
│   ├── models/             # Modelos de dominio (Mesa.js, Reserva.js)
│   └── index.js            # Punto de entrada de la API
├── .env.example            # Plantilla de variables de entorno sin secretos reales
├── .gitignore              # Archivos y carpetas excluidos de Git (incluye .env y node_modules)
└── README.md               # Documentación general del proyecto
Dominio y Base de Datos
El sistema persiste su información en una base de datos relacional MySQL utilizando Sequelize. Los modelos principales del dominio son:

Mesa: Gestiona el número de mesa y su capacidad de comensales.

Reserva: Vincula a un cliente con una mesa específica en una fecha y hora determinada.

Las tablas correspondientes se generan ejecutando los archivos de configuración ubicados en la carpeta migrations/.

Requisitos Previos
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
Copia el archivo de ejemplo para configurar tu entorno sin exponer credenciales:

Bash
cp .env.example .env
(Si estás en Windows y el comando cp no funciona, copia y pega el archivo manualmente y renómbralo a .env).

Luego, abre tu nuevo archivo .env y reemplaza los valores de ejemplo por las credenciales reales de tu base de datos MySQL local.

2. Instalar dependencias
Instala las dependencias necesarias para el Backend y el Frontend:

Bash
# Instalar dependencias del backend (Express, Sequelize, MySQL2, etc.)
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


//////////////////////////////////////////////////////////////////////////////

🚀 Resumen de Avance: Proyecto MVP Reservas
Hola equipo, les dejo un resumen de lo que ya está configurado en el repositorio. Ya tenemos listos los primeros 3 requerimientos generales obligatorios (MVP-GEN-01 al 03) y la base de datos estructurada.

1. Estructura del Repositorio (MVP-GEN-01)

Ya tenemos la arquitectura base dividida en dos partes:

client/: Para el frontend (configurado con Vite).

src/: Para el backend (Node.js + Express).

Se configuró el archivo package.json en la raíz. Si clonan el repo y ejecutan npm run dev, el proyecto levanta sin errores (cumpliendo la rúbrica del profesor).

El README.md ya está redactado con las instrucciones exactas de instalación.

2. Variables de Entorno y Seguridad (MVP-GEN-02)

Se creó el archivo .env.example con las variables de muestra (puerto, credenciales de BD, y JWT Secret).

El archivo .gitignore ya está configurado para ocultar la carpeta node_modules y evitar que nuestros passwords reales (.env) se suban a GitHub.

3. Base de Datos y Modelos (MVP-GEN-03)

Decidimos usar MySQL con Sequelize como ORM.

Ya se crearon los archivos de migración y los modelos en la carpeta src/models/ para 3 entidades:

Usuario: Con roles (admin y cliente) y credenciales.

Mesa: Con número y capacidad.

Reserva: Vinculada a la mesa mediante llave foránea, con nombre del cliente y fecha/hora.

Nota BD: Ya tenemos el script SQL listo para que cada uno pueda crear la base de datos reservas_db y estas 3 tablas en su propio MySQL local con un solo copy-paste.

Siguientes pasos para el equipo:

Clonar el repo, hacer npm install y probar que a todos les levante el entorno.

Conectar Express con la base de datos de MySQL en nuestro archivo principal.

Empezar a repartirnos las rutas y controladores (ej. crear usuarios, hacer reservas) o el diseño del frontend.