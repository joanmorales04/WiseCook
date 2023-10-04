import React, { useState } from 'react';
import './App.css';

function App() {
  const [prepTime, setPrepTime] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  
  const [title, setTitle] = useState();
  const [generatedTime, setGeneratedTime] = useState();
  const [cookTime, setCookTime] = useState();
  const [sevings, setServings] = useState();
  const [generatedIngredients, setGeneratedIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);

  const handleIngredientChange = (event, index) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = event.target.value;
    setIngredients(newIngredients);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
  
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
      } else {
        console.error('Failed to submit form:', await response.text());
      }
    } catch (error) {
      console.error('An error occurred while submitting the form:', error);
    }
  }

  return (
    <div className="app-container">
      <h1>WiseCook</h1>
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
  );
}

export default App;