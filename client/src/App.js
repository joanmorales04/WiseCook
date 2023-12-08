import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Login from './pages/Login'; 
import Home from './pages/Home'; 
import Recipes from './pages/Recipes'
import Navbar from './navigation/Navbar';
import './App.css';

function App() {
 
  const [user, setUser] = useState({});

  const handleSignOut = () => {
    setUser({});
  };

return (
  <Router>
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/home" element={<Home user={user} setUser={setUser} handleSignOut={handleSignOut} />} />
        <Route path="/recipes" element={<Recipes user={user} setUser={setUser} handleSignOut={handleSignOut} />} />
        <Route path="/*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  </Router>
);
}

export default App;