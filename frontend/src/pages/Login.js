import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/auth';
import './login.css';

function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    const result =
      await login(
        userId,
        password
      );

    if (result.token) {
      navigate('/dashboard');
    } else {
      setError(
        result.error ||
        'Login failed'
      );
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-bg"></div>

      <div className="auth-card">

        <h1>
          Campus Lost & Found
        </h1>

        <p className="subtitle">
          Welcome Back 👋
        </p>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) =>
              setUserId(
                e.target.value
              )
            }
            required
          />

          <div className="password-box">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              required
            />

            <span
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {showPassword
                ? "🙈"
                : "👁️"}
            </span>

          </div>

          <button
            type="submit"
          >
            Login
          </button>

        </form>

        <p className="switch-link">
          Don't have an account?

          <Link to="/register">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;