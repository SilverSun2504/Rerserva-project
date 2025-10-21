

# Sistema de Reservas de Salas 🚀

Un sistema web completo para la gestión y reserva de salas de reuniones, construido con un stack de tecnologías moderno, separando el frontend del backend para una mayor escalabilidad y mantenibilidad.



## ✨ Características Principales

  * **Autenticación de Usuarios**: Sistema de registro e inicio de sesión seguro con encriptación de contraseñas.
  * **Gestión de Salas**: Creación, listado y eliminación de salas de reuniones.
  * **Interfaz Moderna**: Frontend interactivo y responsivo construido con Next.js y Tailwind CSS.
  * **API Robusta**: Backend RESTful construido con Node.js y Express para manejar toda la lógica de negocio.
  * **Base de Datos Relacional**: PostgreSQL para un almacenamiento de datos persistente y seguro.
  * **Contenerizado con Docker**: Entorno de desarrollo aislado y reproducible gracias a Docker.

-----

## 🛠️ Tecnologías Utilizadas

| Frontend | Backend | Base de Datos | Entorno |
| :--- | :--- | :--- | :--- |
| Next.js | Node.js | PostgreSQL | Docker |
| React | Express.js | | |
| TypeScript | | | |
| Tailwind CSS | | | |

-----

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado el siguiente software en tu máquina:

  * **[Node.js](https://nodejs.org/)** (versión 18.x o superior)
  * **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (asegúrate de que esté abierto y en ejecución)

-----

## 🚀 Cómo Empezar

Sigue estos pasos para levantar el proyecto completo en tu entorno local.

### 1\. Clonar el Repositorio

Primero, clona este repositorio en tu máquina local.

```bash
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
```

### 2\. Iniciar la Base de Datos

La base de datos PostgreSQL corre en un contenedor de Docker.

  * Abre una terminal en la **raíz del proyecto** y ejecuta:

<!-- end list -->

```bash
docker-compose up -d
```

Esto iniciará la base de datos en segundo plano.

### 3\. Configurar y Levantar el Backend

El backend es el servidor que se conecta a la base de datos y provee la API.

  * Abre una **nueva terminal** y navega a la carpeta `backend`:

<!-- end list -->

```bash
cd backend
```

  * Instala las dependencias:

<!-- end list -->

```bash
npm install
```

  * Inicia el servidor:

<!-- end list -->

```bash
npm start
```

Verás un mensaje confirmando que el servidor está corriendo en `http://localhost:3001`.

### 4\. Configurar y Levantar el Frontend

Finalmente, levanta la aplicación visual de Next.js.

  * Abre una **tercera terminal** y navega a la carpeta `frontend`:

<!-- end list -->

```bash
cd frontend
```

  * Instala las dependencias:

<!-- end list -->

```bash
npm install
```

  * Inicia la aplicación:

<!-- end list -->

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

-----

## 🗂️ Estructura del Proyecto

Este proyecto utiliza una arquitectura de **monorepo** para mantener el código organizado:

  * **`/frontend`**: Contiene toda la aplicación de Next.js. Es la parte visual con la que interactúa el usuario.
  * **`/backend`**: Contiene el servidor de Node.js/Express. Maneja la lógica de negocio, la API y la comunicación con la base de datos.
  * **`docker-compose.yml`**: Archivo de configuración para orquestar los servicios de Docker (en este caso, la base de datos).

-----

## 🌱 Poblar la Base de Datos (Opcional)

Para tener datos de prueba (usuarios y salas) desde el inicio, puedes ejecutar los scripts de inicialización y "siembra".

1.  **Crear las tablas**: Asegúrate de que el contenedor de Docker esté corriendo. En la terminal del `backend`, ejecuta:
    ```bash
    node init-db.js
    ```
2.  **Poblar con datos de ejemplo**: A continuación, ejecuta el script de siembra:
    ```bash
    node seed.js
    ```

Esto llenará tu base de datos con salas de ejemplo para que puedas probar la aplicación inmediatamente.
