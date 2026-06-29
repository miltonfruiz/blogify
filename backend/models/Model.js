```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String }
});

usuarioSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

usuarioSchema.methods.generarToken = function() {
  const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
  this.token = token;
  return token;
};

usuarioSchema.methods.comprobarPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const comentarioSchema = new mongoose.Schema({
  texto: { type: String, required: true },
  autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  fecha: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  contenido: { type: String, required: true },
  autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  comentarios: [comentarioSchema],
  fecha: { type: Date, default: Date.now }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
const Comentario = mongoose.model('Comentario', comentarioSchema);
const Post = mongoose.model('Post', postSchema);

module.exports = { Usuario, Comentario, Post };
```