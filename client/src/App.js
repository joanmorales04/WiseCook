import React, { useState } from 'react';
import Login from './pages/Login'; 
import Home from './pages/Home'; 
import './App.css';

function App() {
  const [user, setUser] = useState({});

	const handleSignOut = () => {
    setUser({});
  };

  return (
    <div className="App">
      {Object.keys(user).length === 0 ? (
         <Login user={user} setUser={setUser} handleSignOut={handleSignOut} />
      ) : (
				<Home user={user} handleSignOut={handleSignOut} />
      )}

    </div>
  );
}

export default App;
