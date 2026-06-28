# MVP-GEN-01: Repositorio ejecutable

## Información General
* **Rol:** Como desarrollador
* **Necesidad:** Quiero un repositorio con estructura `client/` + API + `README.md` ejecutable.
* **Valor:** Para que cualquiera pueda clonar, instalar y levantar el proyecto localmente sin fricciones.

## Criterios de Aceptación
1. **Configuración exitosa:** Dado el repositorio entregado, cuando se siguen las instrucciones del `README.md` (clonar, instalar dependencias, configurar variables de entorno y ejecutar), entonces tanto la API como el frontend levantan en el entorno local sin errores críticos.
2. **Estructura correcta:** Dado el repositorio, cuando se revisa la raíz, entonces existen las carpetas `client/` para el frontend y el backend estructurado con `src/` (controllers, middlewares, models, routes, services) y `migrations/` visibles.
3. **Claridad en la documentación:** Dado el `README.md`, cuando es leído por un tercero, entonces describe claramente el stack tecnológico, los pasos de instalación, el listado de variables de entorno necesarias (`.env.example`) y los comandos de ejecución.

## Interfaz Web
* No requiere.

## MVP-GEN-02: Variables de entorno documentadas

* **Obligatoriedad:** Obligatoria

**Historia de usuario**
* **Como** desarrollador
* **Quiero** un archivo `.env.example` sin secretos reales
* **Para** configurar el entorno sin exponer credenciales

**Criterios de aceptación**
1. Dado el repositorio, cuando busco `.env.example`, entonces existe y lista las variables necesarias.
2. Dado `.env.example`, cuando reviso el contenido, entonces no contiene passwords ni JWT secrets reales.
3. Dado el README, cuando consulto configuración, entonces explica cómo copiar `.env.example` a `.env`.

**Requiere interfaz web:** No

## MVP-GEN-03: Base de datos y modelos

* **Obligatoriedad:** Obligatoria

**Historia de usuario**
* **Como** equipo
* **Quiero** al menos 2 modelos Sequelize con migraciones en MySQL (Adaptado de PostgreSQL)
* **Para** persistir el dominio del sistema (Mesas y Reservas)

**Criterios de aceptación**
1. Dado el proyecto, cuando se revisa el repositorio, existen los archivos de migración correspondientes en la carpeta `migrations/`.
2. Dado los modelos, cuando se revisa el código en `src/models/`, están definidos utilizando la estructura de Sequelize para las entidades `Mesa` y `Reserva`.

**Requiere interfaz web:** No