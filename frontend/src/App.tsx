```tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Tipo de dato para un post
interface Post {
  id: number;
  title: string;
  content: string;
  comments: Comment[];
}

// Tipo de dato para un comentario
interface Comment {
  id: number;
  content: string;
}

// Tipo de dato para el usuario
interface User {
  id: number;
  username: string;
  token: string;
}

// Estado inicial de la aplicación
const initialState = {
  posts: [],
  user: null,
  token: '',
};

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [newPostTitle, setNewPostTitle] = useState<string>('');
  const [newPostContent, setNewPostContent] = useState<string>('');
  const [newCommentContent, setNewCommentContent] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Obtener token desde localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []);

  // Obtener posts desde el servidor
  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/posts')
        .then(response => {
          setPosts(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [token]);

  // Función para registrar un nuevo usuario
  const handleRegister = () => {
    axios.post('http://localhost:5000/register', { username, password })
      .then(response => {
        const token = response.data.token;
        setToken(token);
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      })
      .catch(error => {
        console.error(error);
      });
  };

  // Función para iniciar sesión
  const handleLogin = () => {
    axios.post('http://localhost:5000/login', { username, password })
      .then(response => {
        const token = response.data.token;
        setToken(token);
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      })
      .catch(error => {
        console.error(error);
      });
  };

  // Función para crear un nuevo post
  const handleCreatePost = () => {
    axios.post('http://localhost:5000/posts', { title: newPostTitle, content: newPostContent })
      .then(response => {
        setPosts([...posts, response.data]);
      })
      .catch(error => {
        console.error(error);
      });
  };

  // Función para crear un nuevo comentario
  const handleCreateComment = (postId: number) => {
    axios.post(`http://localhost:5000/posts/${postId}/comments`, { content: newCommentContent })
      .then(response => {
        const updatedPosts = posts.map(post => {
          if (post.id === postId) {
            post.comments = [...post.comments, response.data];
          }
          return post;
        });
        setPosts(updatedPosts);
      })
      .catch(error => {
        console.error(error);
      });
  };

  // Función para seleccionar un post
  const handleSelectPost = (post: Post) => {
    setSelectedPost(post);
  };

  return (
    <div>
      {user ? (
        <div>
          <h1>Blog</h1>
          <ul>
            {posts.map(post => (
              <li key={post.id}>
                <h2>{post.title}</h2>
                <p>{post.content}</p>
                <button onClick={() => handleSelectPost(post)}>Ver comentarios</button>
                <ul>
                  {post.comments.map(comment => (
                    <li key={comment.id}>
                      <p>{comment.content}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={newPostTitle}
            onChange={e => setNewPostTitle(e.target.value)}
            placeholder="Título del post"
          />
          <input
            type="text"
            value={newPostContent}
            onChange={e => setNewPostContent(e.target.value)}
            placeholder="Contenido del post"
          />
          <button onClick={handleCreatePost}>Crear post</button>
          {selectedPost && (
            <div>
              <input
                type="text"
                value={newCommentContent}
                onChange={e => setNewCommentContent(e.target.value)}
                placeholder="Comentario"
              />
              <button onClick={() => handleCreateComment(selectedPost.id)}>Crear comentario</button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h1>Iniciar sesión o registrar</h1>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Nombre de usuario"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Contraseña"
          />
          <button onClick={handleLogin}>Iniciar sesión</button>
          <button onClick={handleRegister}>Registrar</button>
        </div>
      )}
    </div>
  );
}

export default App;
```