import React, { useState } from 'react';
import { useEffect } from 'react';
import jwt_decode from "jwt-decode";

function Login({user, setUser}) {

  function handleCallbackResponse(response) {
    var userObject = jwt_decode(response.credential);
    setUser(userObject);

    document.getElementById("login").hidden = true;
  }

  function handleSignOut(event) {
    setUser({});
    document.getElementById("login").hidden = false;
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

  }, []);

  return (
    <div className="App">
      <div id="login">
        <h1 id="welcome">Welcome Back!</h1>
        <div id="signInDiv"></div>
      </div>

      { Object.keys(user).length !== 0 && 
        <button onClick={ (e) => handleSignOut(e)}>Sign Out</button>
      }
      
      { user && 
        <div>
          <h3>{user.name}</h3>
        </div>
      }

    </div>
  );
}

export default Login;
