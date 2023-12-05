import jwt_decode from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import Navbar from '../navigation/Navbar';
import Hero from '../navigation/Hero';
import Login from './Login'; // Import Login from the parent directory
import '../App.css'; // Import App.css from the parent directory



function Recipes({user, handleSignOut}) {

  const [recipes, setRecipes] = useState();

  console.log("this is user: ", user);
  console.log("this is user recipes: ", user.user_recipes);


//   useEffect(() => {
//     const fetchSavedRecipes = async () => {
      
//       try {
//         const response = await fetch('http://localhost:8080/allsavedrecipes', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ user: user }),
//         });

//         if (response.ok) {

//           const savedRecipesResponses = await response.json();
//           const savedRecipes = savedRecipesResponses.recipes;

//           console.log("These are the saved recipes: ", savedRecipes);
//           //setRecipes(savedRecipes);
          
        
//         } else {
//           throw new Error('Failed to load saved recipes');
//         }
//       } catch (error) {
//         console.error('An error occurred while loading the saved recipes:', error);
//       }
//     };

//   fetchSavedRecipes();
// }, []); 


  return (
    <div>
      <Navbar user={user} handleSignOut={handleSignOut}></Navbar>

      <Hero 
      cName="hero" 
      heroImg='https://www.steriflow.com/wp-content/uploads/2020/12/propo-agro.jpg'
      >
      </Hero>

      <div className="savedrecipes-container">

      <p> Insert the saved recipes here in their own card element </p>

      </div>

    </div>
  );
  
};

export default Recipes;