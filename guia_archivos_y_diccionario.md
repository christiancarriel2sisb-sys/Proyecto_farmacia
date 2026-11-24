# Guía de Estructura del Proyecto y Diccionario de Datos

Preparé este documento para mostrar cómo dejé organizada la arquitectura del proyecto, qué función cumple cada archivo, cómo se comunican el servidor y la interfaz, y el diccionario de datos con las variables y funciones que ya están implementadas.

---

## Parte 1: Organización General y Estructura de Archivos

El sistema está dividido en dos capas principales para mantener el orden y la seguridad de los datos:

1. **El Backend (Servidor - Carpeta `src/`):** Corre sobre Node.js en el servidor/equipo. Todo su registro de actividad (`logs`) se ve por consola/terminal. Es la única capa que tiene acceso directo a MariaDB y a las credenciales del archivo `.env`.
2. **El Frontend (Interfaz Web - Carpeta `public/`):** Es la parte visual que se carga en el navegador (`http://localhost:3000`). Solo muestra la información y hace consultas al backend, sin exponer datos sensibles de la base de datos.

---

### 1. Archivos Base en la Raíz (`a:\Proyecto_farmacia\`)

| Archivo | Función dentro del proyecto | Dónde actúa | Cuándo se modifica |
| :--- | :--- | :--- | :--- |
| **[`.env`](file:///a:/Proyecto_farmacia/.env)** | Archivo privado de configuración. Guarda el puerto del sistema (`PORT`) y las credenciales de acceso a la base de datos (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`). | Lo carga Node.js automáticamente al iniciar el servidor. | Solo si cambiamos la IP del servidor de base de datos, el usuario o las contraseñas. *(Nota: Al cambiar este archivo hay que reiniciar el servicio).* |
| **[`package.json`](file:///a:/Proyecto_farmacia/package.json)** | Ficha técnica del proyecto en Node.js. Define las librerías utilizadas (`fastify`, `mysql2`, `dotenv`, etc.) y los scripts de arranque como `npm run dev`. | En la consola al instalar dependencias o levantar el servidor. | Cuando sumemos alguna librería nueva al proyecto o agreguemos comandos de ejecución. |
| **[`.gitignore`](file:///a:/Proyecto_farmacia/.gitignore)** | Filtro de seguridad para Git. Evita que se suban al repositorio carpetas pesadas (`node_modules/`) o archivos con contraseñas (`.env`). | En el control de versiones (Git / GitHub). | Si más adelante agregamos otros archivos locales o credenciales que no deban subirse al repositorio. |

---

### 2. Archivos del Frontend / Interfaz (`public/`)

En la carpeta `public/` dejé separado todo lo que corresponde a la pantalla que se ve en el navegador.

| Archivo | Función dentro del proyecto | Dónde se refleja | Qué se trabaja aquí |
| :--- | :--- | :--- | :--- |
| **[`public/index.html`](file:///a:/Proyecto_farmacia/public/index.html)** | Estructura base de la pantalla. Define los encabezados, tarjetas informativas (`<section class="card">`), botones y el contenedor (`<ul id="lista-databases">`) donde se listan las bases de datos detectadas. | Al abrir **`http://localhost:3000`** en el navegador. | Aquí se agregan nuevos textos, tablas, formularios, botones o secciones de la interfaz. |
| **[`public/css/styles.css`](file:///a:/Proyecto_farmacia/public/css/styles.css)** | Hoja de estilos visuales. Controla la presentación general: colores, tipografía, diseño de tarjetas y los indicadores visuales de estado (verde cuando conecta bien, rojo si hay error). | En **`http://localhost:3000`** (define el aspecto visual de la página). | Ajustes de diseño, colores, distribución de elementos y estética general. |
| **[`public/js/main.js`](file:///a:/Proyecto_farmacia/public/js/main.js)** | Lógica de la interfaz en el navegador. Al cargar la página consulta al servidor mediante `fetch('/api/databases')`, recibe el listado de bases de datos en JSON y arma dinámicamente los elementos `<li>` en pantalla. | En **`http://localhost:3000`** (carga de datos en vivo) y en la consola del navegador (`F12`). | Toda la interacción de la página: peticiones de datos al backend, eventos de botones y actualización de datos en pantalla. |

---

### 3. Archivos del Backend / Servidor (`src/`)

En `src/` está toda la lógica del servidor en Node.js, la conexión con MariaDB y la estructura de carpetas que ya dejé preparada para los siguientes módulos del sistema.

| Carpeta / Archivo | Función dentro del proyecto | Dónde se refleja | Propósito en el desarrollo |
| :--- | :--- | :--- | :--- |
| **[`src/config/db.js`](file:///a:/Proyecto_farmacia/src/config/db.js)** | **Módulo de conexión a MariaDB.** Toma las credenciales del `.env` y mantiene un `pool` de conexiones activas usando `mysql2/promise`. | Lo utiliza internamente el servidor (`src/app.js`) y las futuras consultas de `src/models/`. | Ya quedó configurado; solo se tocaría si necesitamos ajustar el límite de conexiones simultáneas (`connectionLimit`). |
| **[`src/app.js`](file:///a:/Proyecto_farmacia/src/app.js)** | **Archivo principal del servidor.** Levanta Fastify en el puerto `3000`, sirve la carpeta `public/`, expone la ruta `GET /api/databases` (que consulta `SHOW DATABASES`) y muestra en consola las bases de datos disponibles apenas arranca. | 1) En la **consola del servidor** al iniciar.<br>2) En **`http://localhost:3000/api/databases`** (respuesta en formato JSON). | Punto central donde se registran las rutas generales y la configuración de arranque del servidor. |
| **`src/routes/`** *(preparada)* | Carpeta destinada a organizar las rutas o endpoints de la API a medida que crezca el sistema (ej. `/api/productos`, `/api/droguerias`). | En las consultas HTTP que hace el frontend. | Aquí iremos separando las URLs por cada módulo del negocio. |
| **`src/controllers/`** *(preparada)* | Carpeta para los controladores que recibirán las peticiones de `routes/`, procesarán la lógica y devolverán la respuesta. | En las respuestas JSON de la API. | Mantener ordenada la lógica de negocio separada de las rutas. |
| **`src/models/`** *(preparada)* | Carpeta donde irán las consultas SQL (`SELECT`, filtros, cruces de tablas) utilizando el conector de `src/config/db.js`. | Entrega los datos de MariaDB hacia los controladores. | Centralizar todas las consultas a las tablas de la base de datos. |
| **`src/adapters/`** *(preparada)* | Carpeta pensada para manejar un conector independiente por cada droguería o proveedor al consultar precios y catálogos. | En los módulos de consulta y comparación de precios. | Integración ordenada con cada proveedor o droguería. |
| **`src/services/`** *(preparada)* | Carpeta para funciones de soporte transversal (utilidades, cifrado, cálculos o conexión con servicios externos como el SII). | Usada internamente por controladores y procesos del sistema. | Reutilizar funciones comunes en distintas partes de la aplicación. |
| **`src/workers/`** *(preparada)* | Carpeta para procesos pesados en segundo plano (automatizaciones con Playwright y tareas programadas con `node-cron`). | En los registros de ejecución en segundo plano. | Aquí programaremos los robots de extracción de datos (scraping) y tareas automáticas. |

---

## Parte 2: Diccionario de Datos y Variables Implementadas

A continuación detallo las constantes, variables, funciones y elementos HTML que dejé programados en esta primera etapa, para tener documentado qué hace cada parte del código.

### 1. Archivo [`src/config/db.js`](file:///a:/Proyecto_farmacia/src/config/db.js)

| Nombre de Variable | Tipo | Descripción y función |
| :--- | :--- | :--- |
| `mysql` | `Object` (Módulo) | Librería `mysql2/promise` utilizada para conectarse a MariaDB trabajando de forma asíncrona (`async/await`). |
| `dbConfig` | `Object` | Objeto que centraliza los parámetros de conexión tomados desde `.env`:<br>• `host`: IP o dirección del servidor (`process.env.DB_HOST`).<br>• `port`: Puerto de conexión (`process.env.DB_PORT`, por defecto `3306`).<br>• `user`: Usuario de MariaDB (`process.env.DB_USER`).<br>• `password`: Clave de acceso (`process.env.DB_PASSWORD`).<br>• `database`: Base de datos inicial (`process.env.DB_NAME`).<br>• `waitForConnections`: `true` (gestiona la espera si las conexiones están en uso).<br>• `connectionLimit`: `10` (tope de 10 conexiones simultáneas en el pool).<br>• `queueLimit`: `0` (sin límite en la cola de peticiones). |
| `pool` | `Pool` (Instancia) | Pool de conexiones activas hacia MariaDB generado con `mysql.createPool(dbConfig)`. Es el componente que expone `pool.query(...)` para ejecutar consultas SQL. |

---

### 2. Archivo [`src/app.js`](file:///a:/Proyecto_farmacia/src/app.js)

| Nombre de Variable / Función | Tipo | Descripción y función |
| :--- | :--- | :--- |
| `path` | `Object` (Módulo) | Módulo nativo de Node.js para resolver rutas de carpetas (`path.join`) de forma compatible entre distintos sistemas operativos. |
| `fastify` | `FastifyInstance` | Instancia principal del servidor web Fastify con registro de actividad (`logger: true`) habilitado en consola. |
| `pool` | `Pool` | Conector de MariaDB importado desde `./config/db`. |
| `dbConfig` | `Object` | Parámetros de conexión (`host`, `port`, `user`) importados desde `./config/db` para informar por consola y en la interfaz a qué servidor estamos conectados. |
| `request` | `FastifyRequest` | Objeto del endpoint `/api/databases` que contiene los datos de la consulta entrante. |
| `reply` | `FastifyReply` | Objeto del endpoint `/api/databases` usado para responder al cliente y manejar códigos de estado HTTP (por ejemplo, `reply.code(500)` ante un fallo de conexión). |
| `rows` | `Array<Object>` | Resultado directo que entrega MariaDB al ejecutar `SHOW DATABASES` (ej. `[{ Database: 'information_schema' }, { Database: 'farmacia' }]`). |
| `databases` | `Array<String>` | Arreglo limpio solo con los nombres de las bases de datos (ej. `['information_schema', 'farmacia']`), generado a partir de `rows`. |
| `start` | `Async Function` | Función de arranque que inicia el servidor en el puerto configurado (`3000`) y ejecuta una comprobación inicial (`SHOW DATABASES`) mostrando las bases disponibles en consola. |
| `port` | `Number` | Puerto en el que escucha el servidor web, tomado de `process.env.PORT` (o `3000` por defecto). |

---

### 3. Archivos [`public/js/main.js`](file:///a:/Proyecto_farmacia/public/js/main.js) y [`public/index.html`](file:///a:/Proyecto_farmacia/public/index.html)

| Variable en JS | ID en `index.html` | Tipo | Descripción y función |
| :--- | :--- | :--- | :--- |
| `estadoConexion` | `#estado-conexion` | `HTMLElement (<div>)` | Indicador visual en pantalla que muestra en verde cuando la conexión con MariaDB está activa o en rojo si ocurre algún problema. |
| `infoServidor` | `#info-servidor` | `HTMLElement (<p>)` | Muestra en la interfaz el servidor (`host`), puerto y usuario con los que está trabajando el backend. |
| `contadorBd` | `#contador-bd` | `HTMLElement (<span>)` | Muestra entre paréntesis el total de bases de datos detectadas en el servidor (ej. `Bases de Datos Encontradas (5)`). |
| `listaDatabases` | `#lista-databases` | `HTMLElement (<ul>)` | Contenedor visual donde se inserta un ítem (`<li>`) por cada base de datos encontrada. |
| `btnRecargar` | `#btn-recargar` | `HTMLElement (<button>)` | Botón `"Volver a Consultar"` que permite refrescar los datos desde MariaDB sin recargar toda la página. |
| `consultarBasesDeDatos` | — | `Async Function` | Función principal en el navegador: se ejecuta al abrir la página, consulta `fetch('/api/databases')` y actualiza la pantalla con la respuesta del servidor. |
| `response` | — | `Response` | Respuesta HTTP obtenida al llamar al endpoint `/api/databases`. |
| `data` | — | `Object (JSON)` | Datos en formato JSON devueltos por el backend: `{ ok, mensaje, servidor, puerto, usuario, total, databases }`. |
| `dbName` | — | `String` | Variable usada en el recorrido (`forEach`) que contiene el nombre de cada base de datos al momento de agregarla a la lista visual. |
| `li` | — | `HTMLElement (<li>)` | Elemento de lista creado dinámicamente en JavaScript para mostrar cada base de datos en pantalla. |
