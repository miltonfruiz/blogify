# Blog App
================

## Descripción
La aplicación de blog permite a los usuarios crear, leer y comentar posts. La autenticación es requerida para crear y comentar posts.

## Stack
* Backend: Node.js con Express.js
* Base de datos: MongoDB
* Autenticación: JSON Web Tokens (JWT)
* Frontend: React.js (opcional)

## Instalación
```bash
git clone https://github.com/tu-repo/blog-app.git
cd blog-app
npm install
```

## Docker
```bash
docker build -t blog-app .
docker run -p 3000:3000 blog-app
```

## Endpoints
### Autenticación
* **POST /api/auth/login**: Inicia sesión con correo electrónico y contraseña
* **POST /api/auth/register**: Registra un nuevo usuario
* **GET /api/auth/profile**: Obtiene el perfil del usuario autenticado

### Posts
* **GET /api/posts**: Obtiene todos los posts
* **GET /api/posts/:id**: Obtiene un post por ID
* **POST /api/posts**: Crea un nuevo post
* **PUT /api/posts/:id**: Actualiza un post
* **DELETE /api/posts/:id**: Elimina un post

### Comentarios
* **GET /api/posts/:id/comments**: Obtiene todos los comentarios de un post
* **POST /api/posts/:id/comments**: Crea un nuevo comentario

## Seguridad
* La autenticación se realiza mediante JSON Web Tokens (JWT)
* Los passwords se almacenan cifrados con bcrypt
* La aplicación utiliza HTTPS para cifrar la comunicación
* La aplicación utiliza helmet para proteger contra ataques de seguridad comunes

## Contribuir
Las contribuciones son bienvenidas. Por favor, crea un fork de este repositorio y envía un pull request con tus cambios.

## Licencia
Este proyecto está licenciado bajo la licencia MIT.