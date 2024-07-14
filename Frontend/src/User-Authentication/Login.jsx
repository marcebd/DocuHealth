import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const data = { email, password };
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      if (!response.ok) {
        setError(response.statusText || 'Failed to login');
      } else {
        const jsonData = await response.json();
        localStorage.setItem('userId', JSON.stringify(jsonData.userId));
        localStorage.setItem('token', jsonData.token);
        navigate('/dashboard');
      }
    } catch (error) {
      setError('Network error');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='loginForm' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
      <form onSubmit={handleSubmit} aria-live="polite" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ marginBottom: '20px' }}>Login</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          aria-label="Email"
          style={{ width: '100%', padding: '10px', margin: '10px 0', border: 'none', borderBottom: '1px solid #ccc' }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          aria-label="Password"
          style={{ width: '100%', padding: '10px', margin: '10px 0', border: 'none', borderBottom: '1px solid #ccc' }}
        />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button type="submit" disabled={isLoading} style={{ cursor: isLoading ? 'wait' : 'pointer' }}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>
        <p style={{ fontSize: '14px', color: '#666', margin: '10px 0' }}>
          Don't have an account?{' '}
          <a href="/register" style={{ color: '#337ab7', textDecoration: 'none' }}>
            Sign up
          </a>
        </p>
        {error && <p style={{ color: 'red', margin: '10px 0' }}>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
