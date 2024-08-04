import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './User-Authentication/Login';
import Register from './User-Authentication/Register';
import Profile from './User-Authentication/Profile';
import LandingPage from './LandingPage/LandingPage';
import DoctorsHome from './Driver/DoctorsHome';

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
            <Route path="/dashboard" element={<DoctorsHome />} />
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
