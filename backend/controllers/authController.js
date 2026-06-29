```javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Por favor, llene todos los campos.' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: 'Usuario creado con éxito.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al registrar el usuario.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor, llene todos los campos.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'El correo electrónico o la contraseña son incorrectos.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'El correo electrónico o la contraseña son incorrectos.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Error al iniciar sesión.' });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Sesión cerrada con éxito.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al cerrar la sesión.' });
  }
};

module.exports = { register, login, logout };
```