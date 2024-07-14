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

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: 'white'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '300px',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: 'white'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc'
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    margin: '20px 0',
    backgroundColor: '#ffffff',
    color: '#333',
    border: '1px solid #ccc',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    if (!validateForm()) return;
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
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2>Create an Account</h2>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          style={inputStyle}
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          style={inputStyle}
        />
        <input
          type="password"
          name="password2"
          value={formData.password2}
          onChange={handleChange}
          placeholder="Confirm Password"
          required
          style={inputStyle}
        />
        <button type="submit" disabled={isLoading} style={buttonStyle}>
          {isLoading ? 'Creating...' : 'Create Account'}
        </button>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <p>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#007bff' }}>
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}

export default Register;
