import React, {
  useState
} from 'react';

import {
  useNavigate,
  Link
} from 'react-router-dom';

import {
  register
} from '../services/auth';

import './login.css';

function Register() {

  const [userId, setUserId] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword
  ] = useState("");

  const [
    showPassword,
    setShowPassword
  ] = useState(false);

  const [error, setError] =
    useState("");

  const navigate =
    useNavigate();

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setError("");

      if (
        password !==
        confirmPassword
      ) {
        setError(
          "Passwords do not match"
        );
        return;
      }

      const result =
        await register(
          userId,
          password
        );

      if (
        result.message
      ) {
        navigate(
          "/login"
        );
      } else {
        setError(
          result.error
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
          Create Account 🚀
        </p>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <form
          onSubmit={
            handleSubmit
          }
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

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Confirm Password"
            value={
              confirmPassword
            }
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            required
          />

          <button
            type="submit"
          >
            Register
          </button>

        </form>

        <p className="switch-link">

          Already have an account?

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;