import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('https://bejeetest.onrender.com/auth/login', {
        email: username,
        password: password
      });

      const verifyToken = (token, secretKey) => {
        try {
          const decoded = jwt.verify(token, secretKey);
          return decoded;
        } catch (error) {
          console.error('Failed to verify token:', error);
          return null;
        }
      };

      const token = response.data.token;

      localStorage.setItem('token', token);

      setLoggedIn(true);
    } catch (error) {
      console.error('Ошибка входа:', error.message);
      setError('Неверное имя пользователя или пароль');
    } finally {
      setLoading(false);
    }
  };

  if (loggedIn) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="login-container">
      <h2 className="login-title">Вход</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username" className="form-label">Имя пользователя:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Пароль:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
          />
        </div>
        <button type="submit" className="login-button">Войти</button>
      </form>
      {loading && <p>Loading...</p>} {/* Отображаем loader при загрузке */}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;
