import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: email,
          password: password
        }),
        credentials: 'include', // Necessary for cookies to be sent and received
      });

      if (response.ok && response.redirected) {
        window.location.href = '/dashboard'; // Redirect to dashboard page
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to login');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
        <button type="submit" disabled={isLoading} style={{ cursor: isLoading ? 'wait' : 'pointer' }}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
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
