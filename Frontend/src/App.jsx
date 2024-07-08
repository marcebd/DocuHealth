import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import Home from './Home';
import Login from './User-Authentication/Login';
import Register from './User-Authentication/Register';
import Profile from './User-Authentication/Profile';
import { UserProvider } from './UserContext';

function App() {
  return (
    <UserProvider>
    <Router>
      <div>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
    </UserProvider>
  );
}

export default App;
