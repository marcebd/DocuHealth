import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './Dashboard/Dashboard';
import Login from './User-Authentication/Login';
import Register from './User-Authentication/Register';
import Profile from './User-Authentication/Profile';
import Appointments from './Appointments/Appointments';
import LandingPage from './LandingPage/LandingPage';

function App() {
  const bodyStyle = {
    overflowX: 'hidden',
    minHeight: '100vh',
    minWidth: '100vw'
  };

  return (
      <Router>
        <div id='app' style={bodyStyle}>
          <Routes>
          <Route path="/appointments" element={<Appointments />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
