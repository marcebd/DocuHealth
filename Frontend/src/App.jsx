import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './Dashboard/Dashboard';
import Home from './Home';
import Login from './User-Authentication/Login';
import Register from './User-Authentication/Register';
import Profile from './User-Authentication/Profile';
import { UserProvider } from './UserContext';

function App() {
  const bodyStyle = {
    margin: '2%',
    padding: 0,
    overflowX: 'hidden',
    width: '95%',
    minHeight: '100vh'
  };

  return (
    <UserProvider>
      <Router>
        <div id='app' style={bodyStyle}>
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
