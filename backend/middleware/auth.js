```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. No hay token proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(400).json({ mensaje: 'Token inválido.' });
  }
};

module.exports = authMiddleware;
```