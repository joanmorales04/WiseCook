import jwt_decode from 'jwt-decode';
import React, { useState } from 'react';
import Login from './Login'; // Import Login from the parent directory
import '../App.css'; // Import App.css from the parent directory



function Home({user, handleSignOut}) {

 
  const [prepTime, setPrepTime] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  
  const [title, setTitle] = useState();
  const [generatedTime, setGeneratedTime] = useState();
  const [cookTime, setCookTime] = useState();
  const [sevings, setServings] = useState();
  const [generatedIngredients, setGeneratedIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);

  const [loading, setLoading] = useState(false);

  const handleIngredientChange = (event, index) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = event.target.value;
    setIngredients(newIngredients);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
  
    // Constructing the payload to be sent to the server
    const payload = {
      prepTime,
      ingredients,
    };
    
    try {
      // Making a POST request to the updated '/recipe' endpoint
      const response = await fetch('http://localhost:8080/recipe', { // Updated the URL to '/recipe'
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        const receivedRecipe = await response.json();

        const recipeObject = JSON.parse(receivedRecipe.recipe);

        console.log(recipeObject);

        setTitle(recipeObject.title);
        setGeneratedTime(recipeObject.prep_time);
        setCookTime(recipeObject.cook_time);
        setServings(recipeObject.servings);
        setGeneratedIngredients(recipeObject.ingredients);
        setInstructions(recipeObject.instructions);

        setSubmitted(true);

        setLoading(false);
      } else {
        console.error('Failed to submit form:', await response.text());

        setLoading(false);
      }
    } catch (error) {
      console.error('An error occurred while submitting the form:', error);
      setLoading(false);
    }
  }

  return (
  	<div className="App"> 
      
    
    	<div className="app-container">
      	<h1>WiseCook</h1>

        <nav>
          <ul>
            
            { Object.keys(user).length !== 0 && 
        <button id="navbar-button" onClick={ (e) => handleSignOut(e)}>Sign Out</button>
           }
            <li><a href="/about">About</a></li>
            <li><a href="/recipes">Recipes</a></li>
            <li><a href="/contact">Contact</a></li>


            { user && 
       
          <p id="navbar-name"> {user.name}</p>
        
      }
          </ul>
       </nav>




	      	<div>
		      <form onSubmit={handleSubmit}>
		        <label>
		          Select Prep Time:
		          <select value={prepTime} onChange={(e) => setPrepTime(e.target.value)}>
		            <option value="">Select</option>
		            <option value="15">15 mins</option>
		            <option value="30">30 mins</option>
		            <option value="60">1 hr</option>
		            <option value="over">over 1 hr</option>
		          </select>
		        </label>
		        {ingredients.map((ingredient, index) => (
		          <input
		            key={index}
		            type="text"
		            placeholder="Enter ingredient"
		            value={ingredient}
		            onChange={(e) => handleIngredientChange(e, index)}
		          />
		        ))}
		        
		        <button type="button" onClick={() => setIngredients([...ingredients, ''])}>
		          Add Ingredient
		        </button>
		        
		        <button type="submit">Submit</button>
		      </form>

          {loading && <p className="processing-message">Processing...</p>}
		      
		      {submitted  && (
		        <div className="recipe-container">
		          
		          <h2>Generated Recipe:</h2>
		          <b>{title}</b>
		          <p>Preparation Time: {generatedTime}</p>
		          <p>Cook Time: {cookTime}</p>
		          <p>Makes {sevings} servings</p>

		          <div className="recipe-section"> 
		            <p>Ingredients:</p>
		            <div>
		              {generatedIngredients.map((ingredient, index) => (
		                <p key={index} style={{ marginLeft: '20px' }}>{ingredient}</p>
		              ))}
		            </div>
		          </div>
		          <br></br>

		          <div className="recipe-section"> 
		            <p>Directions:</p>
		            <div>
		              {instructions.map((instruction, index) => (
		                <p key={index} style={{ marginLeft: '20px' }}>{instruction}</p>
		              ))}
		            </div>
		          </div>

		        </div>
		      )}
	      	</div>

      </div>



      {/* { Object.keys(user).length !== 0 && 
        <button onClick={ (e) => handleSignOut(e)}>Sign Out</button>
      } */}
      
      {/* { user && 
        <div>
          <h3>{user.name}</h3>
        </div>
      } */}
    
  	</div>
  );
}

export default Home;