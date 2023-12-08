import jwt_decode from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import Navbar from '../navigation/Navbar';
import Hero from '../navigation/Hero';
import Login from './Login'; // Import Login from the parent directory
import '../App.css'; // Import App.css from the parent directory
import PDF from '../navigation/PDF';



function Recipes({user, setUser, handleSignOut}) {

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      
      try {
        const response = await fetch('http://localhost:8080/allsavedrecipes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user: user }),
        });

        if (response.ok) {

          const savedRecipesResponses = await response.json();
          const savedRecipes = savedRecipesResponses.recipes;
          const recipeObject = JSON.parse(savedRecipes);

          setRecipes(recipeObject);
          
        } else {
          throw new Error('Failed to load saved recipes');
        }
      } catch (error) {
        console.error('An error occurred while loading the saved recipes:', error);
      }
    };

  fetchSavedRecipes();
}, [user]); 

  return (
    <div className="savedrecipes"> 
      <Navbar user={user} handleSignOut={handleSignOut}></Navbar>

      <Hero cName="hero" title = "Saved Recipes"> </Hero>

      <PDF user={user} setUser={setUser} recipes={recipes}></PDF>


    </div>
  );
  
};

export default Recipes;