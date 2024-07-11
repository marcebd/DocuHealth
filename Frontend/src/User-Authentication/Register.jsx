//Saved as local storage Id

import './Register.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    validateForm();
      try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(formData)
        });
        const data = await response.json();
        if (!response.ok) {
            setError(data.message || 'Registration failed');
            console.error('Registration failed:', data);
        } else {
            if (data.userId) {
                localStorage.setItem('userId', JSON.stringify(data.userId));
                navigate('/profile');
            } else {
                setError('Invalid user data received');
            }
        }
    } catch (error) {
        setError('Network error or registration failed');
        console.error('Registration failed:', error);
    } finally {
        setIsLoading(false);
    }
};

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} aria-live="polite" className="register-form">
        <h2>Create an Account</h2>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            aria-label="Email"
            className="register-input"
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            aria-label="Password"
            className="register-input"
          />
        </label>
        <label>
          Confirm Password:
          <input
            type="password"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
            aria-label="Confirm Password"
            className="register-input"
          />
        </label>
        <button type="submit" disabled={isLoading} className="register-button">
          {isLoading ? 'Creating...' : 'Create account'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>
          Already have an account?{' '}
          <a href="/login" className="register-link">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}

export default Register;
