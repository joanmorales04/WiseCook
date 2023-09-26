import React, { useState } from 'react';
import './App.css';

function App() {
  const [prepTime, setPrepTime] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [recipe, setRecipe] = useState(''); // Define recipe state variable

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
        setRecipe(receivedRecipe.recipe);
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
      
      {submitted && recipe && (
        <div className="recipe-container">
          <h2>Generated Recipe:</h2>
          <p>{recipe}</p>
          {/* Render other parts of the recipe as needed */}
        </div>
      )}
    </div>
  );
}

export default App;