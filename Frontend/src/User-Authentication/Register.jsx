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

  const validateForm = () => {
    const { email, password, password2 } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex for validation

    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (password !== password2) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'white' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '300px', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backgroundColor: 'white' }}>
        <h2>Create an Account</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
          required
          style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Password"
          required
          style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input
          type="password"
          name="password2"
          value={formData.password2}
          onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
          placeholder="Confirm Password"
          required
          style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '10px', margin: '20px 0', backgroundColor: '#ffffff', color: '#333', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer' }}>
          {isLoading ? 'Creating...' : 'Create Account'}
        </button>
        <p style={{ fontSize: '14px', color: '#666', margin: '10px 0' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
};
export default Register;
