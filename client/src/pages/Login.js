import React, { useState } from 'react';
import { useEffect } from 'react';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';

function Login({setUser}) {
  const navigate = useNavigate(); 

  async function handleCallbackResponse(response) {
    const userObject = jwt_decode(response.credential);

    try {
        const res = await fetch('http://localhost:8080/login', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userObject:userObject }), // Sending userObject within an object as expected by the server
        });

        if (res.ok) {
            const data = await res.json();
            const userData = JSON.parse(data.user); // Parse the user data since it's sent as a string
            setUser(userData); // setting setUser as userData (userData, being the output of the API Endpoint)
            navigate('/home');
        } else {
            throw new Error('Failed to login');
        }
    } catch (error) {
        console.error('Error logging in:', error);
    }
}

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "552211955611-gghj3t18flru7jpo03undg7bioeevcth.apps.googleusercontent.com",
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large", type: "standard", width: 270, text: 'continue_with'}
    );

  }, [navigate]);

  return (
    <div className="App">
     
      <div className="split-screen">
        
        <div className="left">
          
        </div>

        <div className = "right"> 
          <div className="login-container">
            <div className="header-title">
              <h1 id="login-title">WiseCook</h1>
            </div>
          
            <h2 id="login-subtitle"> Get Started </h2>

            <div id="signInDiv"></div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Login;