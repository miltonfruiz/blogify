```javascript
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ msg: 'Por favor, rellena todos los campos' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'El correo electrónico ya está en uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ nombre, email, password: hashedPassword });

    await newUser.save();
    res.json({ msg: 'Usuario creado con éxito' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al registrar usuario' });
  }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Por favor, rellena todos los campos' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Correo electrónico o contraseña incorrectos' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Correo electrónico o contraseña incorrectos' });
    }

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ msg: 'Error al iniciar sesión' });
  }
});

// Cierre de sesión
router.post('/logout', async (req, res) => {
  try {
    res.json({ msg: 'Sesión cerrada con éxito' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al cerrar sesión' });
  }
});

module.exports = router;
```