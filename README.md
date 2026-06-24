# ProyectoMVPReserva
Proyecto Final de WEB, Relacionado a Reservas

# Sistema de Reservas de Mesas para Restaurantes

Este proyecto consiste en un sistema full-stack diseñado para la gestión y reserva de mesas en tiempo real para restaurantes. Permite a los clientes seleccionar mesas disponibles, elegir horarios y recibir confirmaciones, mientras que el administrador cuenta con un panel de control para gestionar el flujo del local.

## Stack Tecnológico

* **Frontend:** [Por definir - Ej: React.js / Vanilla JavaScript] (Ubicado en `/client`)
* **Backend:** Node.js con Express (Ubicado en la raíz y `/src`)
* **Base de Datos:** MySQL
* **Despliegue de Producción:** Railway

---

## Estructura del Proyecto

El repositorio sigue una arquitectura limpia dividida por capas para facilitar el mantenimiento y la escalabilidad:

```text
PROYECTOMVPRESERVA/
├── client/                 # Código fuente del Frontend
├── migrations/             # Scripts de creación y modificación de tablas (MySQL)
├── src/                    # Código fuente de la API (Backend)
│   ├── controllers/        # Lógica de control de las peticiones HTTP
│   ├── middlewares/        # Funciones intermedias (autenticación, validaciones)
│   ├── models/             # Definición de datos y esquemas de las tablas de MySQL
│   ├── routes/             # Definición de los endpoints de la API
│   └── services/           # Lógica de negocio y consultas a la base de datos
├── .env.example            # Plantilla de variables de entorno
├── .gitattributes          # Configuración de atributos de Git
├── .gitignore              # Archivos y carpetas excluidos del control de versiones
└── README.md               # Documentación general del proyecto