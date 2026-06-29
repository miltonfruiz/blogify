Aquí te presento un ejemplo de un controlador CRUD para una app de blog con posts, comentarios y autenticación en JavaScript:

```javascript
// Controlador de Posts
class PostController {
  constructor(postService) {
    this.postService = postService;
  }

  // Crear un nuevo post
  async createPost(req, res) {
    try {
      const { title, content } = req.body;
      const post = await this.postService.createPost(title, content);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el post' });
    }
  }

  // Obtener todos los posts
  async getAllPosts(req, res) {
    try {
      const posts = await this.postService.getAllPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los posts' });
    }
  }

  // Obtener un post por id
  async getPostById(req, res) {
    try {
      const id = req.params.id;
      const post = await this.postService.getPostById(id);
      if (!post) {
        res.status(404).json({ message: 'Post no encontrado' });
      } else {
        res.json(post);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el post' });
    }
  }

  // Actualizar un post
  async updatePost(req, res) {
    try {
      const id = req.params.id;
      const { title, content } = req.body;
      const post = await this.postService.updatePost(id, title, content);
      if (!post) {
        res.status(404).json({ message: 'Post no encontrado' });
      } else {
        res.json(post);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el post' });
    }
  }

  // Eliminar un post
  async deletePost(req, res) {
    try {
      const id = req.params.id;
      await this.postService.deletePost(id);
      res.status(204).json({ message: 'Post eliminado con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el post' });
    }
  }
}

// Controlador de Comentarios
class CommentController {
  constructor(commentService) {
    this.commentService = commentService;
  }

  // Crear un nuevo comentario
  async createComment(req, res) {
    try {
      const { content, postId } = req.body;
      const comment = await this.commentService.createComment(content, postId);
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el comentario' });
    }
  }

  // Obtener todos los comentarios de un post
  async getAllComments(req, res) {
    try {
      const postId = req.params.postId;
      const comments = await this.commentService.getAllComments(postId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los comentarios' });
    }
  }

  // Obtener un comentario por id
  async getCommentById(req, res) {
    try {
      const id = req.params.id;
      const comment = await this.commentService.getCommentById(id);
      if (!comment) {
        res.status(404).json({ message: 'Comentario no encontrado' });
      } else {
        res.json(comment);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el comentario' });
    }
  }

  // Actualizar un comentario
  async updateComment(req, res) {
    try {
      const id = req.params.id;
      const { content } = req.body;
      const comment = await this.commentService.updateComment(id, content);
      if (!comment) {
        res.status(404).json({ message: 'Comentario no encontrado' });
      } else {
        res.json(comment);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el comentario' });
    }
  }

  // Eliminar un comentario
  async deleteComment(req, res) {
    try {
      const id = req.params.id;
      await this.commentService.deleteComment(id);
      res.status(204).json({ message: 'Comentario eliminado con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el comentario' });
    }
  }
}

// Controlador de Autenticación
class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  // Registrar un nuevo usuario
  async registerUser(req, res) {
    try {
      const { username, password } = req.body;
      const user = await this.authService.registerUser(username, password);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error al registrar el usuario' });
    }
  }

  // Iniciar sesión
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const token = await this.authService.login(username, password);
      if (!token) {
        res.status(401).json({ message: 'Credenciales incorrectas' });
      } else {
        res.json({ token });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al iniciar sesión' });
    }
  }
}

module.exports = { PostController, CommentController, AuthController };
```

Este código define tres controladores: `PostController`, `CommentController` y `AuthController`. Cada controlador tiene métodos para crear, leer, actualizar y eliminar (CRUD) los recursos correspondientes. Los controladores también tienen métodos para registrar usuarios y iniciar sesión.

Es importante destacar que este código es solo un ejemplo y no incluye la implementación de los servicios (`postService`, `commentService` y `authService`) que se utilizan en los controladores. Tampoco incluye la configuración de la base de datos o la autenticación. Es necesario completar estos detalles para que el código funcione correctamente.