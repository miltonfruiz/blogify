```javascript
// Importaciones necesarias
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Configuración de la aplicación
const app = express();
app.use(express.json());

// Variables de configuración
const secretKey = 'mi-llave-secreta';
const usuarios = [];
const posts = [];
const comentarios = [];

// Ruta de registro
app.post('/registro', (req, res) => {
    const { nombre, email, password } = req.body;
    const usuarioExistente = usuarios.find(u => u.email === email);
    if (usuarioExistente) {
        return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const nuevoUsuario = { id: uuidv4(), nombre, email, password: hashedPassword };
    usuarios.push(nuevoUsuario);
    res.json({ mensaje: 'Registro exitoso' });
});

// Ruta de inicio de sesión
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) {
        return res.status(401).json({ mensaje: 'Email o contraseña incorrectos' });
    }
    const isValidPassword = bcrypt.compareSync(password, usuario.password);
    if (!isValidPassword) {
        return res.status(401).json({ mensaje: 'Email o contraseña incorrectos' });
    }
    const token = jwt.sign({ id: usuario.id }, secretKey, { expiresIn: '1h' });
    res.json({ token });
});

// Middleware de autenticación con JWT
const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token inválido' });
    }
};

// Ruta de creación de posts (protegida con JWT)
app.post('/posts', authenticate, (req, res) => {
    const { titulo, contenido } = req.body;
    const nuevoPost = { id: uuidv4(), usuarioId: req.usuario.id, titulo, contenido };
    posts.push(nuevoPost);
    res.json({ mensaje: 'Post creado exitosamente' });
});

// Ruta de lista de posts (protegida con JWT)
app.get('/posts', authenticate, (req, res) => {
    const postsDelUsuario = posts.filter(p => p.usuarioId === req.usuario.id);
    res.json(postsDelUsuario);
});

// Ruta de creación de comentarios (protegida con JWT)
app.post('/comentarios', authenticate, (req, res) => {
    const { postId, comentario } = req.body;
    const postExistente = posts.find(p => p.id === postId);
    if (!postExistente) {
        return res.status(404).json({ mensaje: 'Post no encontrado' });
    }
    const nuevoComentario = { id: uuidv4(), postId, usuarioId: req.usuario.id, comentario };
    comentarios.push(nuevoComentario);
    res.json({ mensaje: 'Comentario creado exitosamente' });
});

// Ruta de lista de comentarios (protegida con JWT)
app.get('/comentarios', authenticate, (req, res) => {
    const comentariosDelUsuario = comentarios.filter(c => c.usuarioId === req.usuario.id);
    res.json(comentariosDelUsuario);
});

// Iniciar servidor
const puerto = 3000;
app.listen(puerto, () => {
    console.log(`Servidor iniciado en el puerto ${puerto}`);
});
```

Esta aplicación Express utiliza JWT para proteger las rutas de creación y lista de posts y comentarios. La autenticación se realiza mediante un middleware que verifica la validez del token proporcionado en la cabecera `Authorization`. Si el token es válido, se permite el acceso a las rutas protegidas. Si no, se devuelve un error 401.