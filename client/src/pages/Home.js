import jwt_decode from 'jwt-decode';
import React, { useState } from 'react';
import Login from './Login'; // Import Login from the parent directory
import '../App.css'; // Import App.css from the parent directory
import Navbar from '../navigation/Navbar';
import Hero from '../navigation/Hero';

function Home({user, handleSignOut}) {


  // const [isBookmarked, setIsBookmarked] = useState(false);

  // const toggleBookmark = () => {
  //   setIsBookmarked(!isBookmarked);
  // };



  // const [saved, setSaved] = useState(false); 

  // // Function to handle saving the recipe
  // const handleSave = () => {
  //   setSaved(!saved);
  // };


 
  const [prepTime, setPrepTime] = useState('');
  const [selectedPrepTime, setSelectedPrepTime] = useState('');

  const [mealType, setMealType] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');

  const [ingredients, setIngredients] = useState(['']);
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

  console.log(selectedPrepTime);
  console.log(ingredients);
  console.log(selectedMealType);
  console.log(mealType);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
  
    // Constructing the payload to be sent to the server
    const payload = {
      prepTime: selectedPrepTime,
      ingredients,
      // mealType: selectedMealType,
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

      <Navbar user={user} handleSignOut={handleSignOut}></Navbar>

      <Hero 
      cName="hero" 
      heroImg='https://www.steriflow.com/wp-content/uploads/2020/12/propo-agro.jpg'
      >
      </Hero>

      <div className="app-container">

        <div class="app-container-left">
          <p className= "app-container-headers"> Select a preparation time: </p>
          <div class="prep-time-buttons-container"> 
            <button
              class={`prep-time-button ${selectedPrepTime === '15' ? 'selected' : ''}`}
              onClick={() => setSelectedPrepTime('15')} >
              15 min
            </button>
            <button
              class={`prep-time-button ${selectedPrepTime === '30' ? 'selected' : ''}`}
              onClick={() => setSelectedPrepTime('30')}>
              30 min
            </button>
            <button
              class={`prep-time-button ${selectedPrepTime === '45' ? 'selected' : ''}`}
              onClick={() => setSelectedPrepTime('45')}>
              45 min
            </button>
            <button
              class={`prep-time-button ${selectedPrepTime === '60' ? 'selected' : ''}`}
              onClick={() => setSelectedPrepTime('60')}>
              60 min
            </button>
          </div>
          <br></br>
          <br></br>

          <p className= "app-container-headers"> Select a type of meal: </p>
          <div class="meal-type-buttons-container">
            <button
              class={`meal-type-button ${selectedMealType === 'breakfast' ? 'selected' : ''}`}
              onClick={() => setSelectedMealType('breakfast')} >
              Breakfast
            </button>
            <button
              class={`meal-type-button ${selectedMealType === 'lunch' ? 'selected' : ''}`}
              onClick={() => setSelectedMealType('lunch')}>
              Lunch
            </button>
            <button
              class={`meal-type-button ${selectedMealType === 'dinner' ? 'selected' : ''}`}
              onClick={() => setSelectedMealType('dinner')}>
              Dinner
            </button>
          </div>
        </div>


        <div className="app-container-right">
            <p className= "app-container-headers"> Enter an ingredient: </p>
            {ingredients.map((ingredient, index) => (
                 <input
                   key={index}
                   type="text"
                   placeholder="Enter ingredient"
                   value={ingredient}
                   onChange={(e) => handleIngredientChange(e, index)}
                   style={{ display: 'block', margin: '0 auto', marginBottom: '10px' }}
                 />  
               ))}
               <button id="ingredient-button" type="button" onClick={() => setIngredients([...ingredients, ''])}>
                 Add Ingredient
               </button>
        </div>
      </div>



      <div className="submit-container">
        <button id="submit-button" type="button" onClick={handleSubmit}>Submit</button>
      </div>



      {loading && <p className="processing-message">Processing...</p>}


  
      {submitted  && (
        <div className="generated-recipe-container"> 
          <h3>Generated Recipe:</h3>
          <br></br>
          <b id="generated-recipe-title">{title}</b>

        <div className="recipe-container">
          <div className="generated-container-left">
            <p> <b> Preparation Time: </b> {generatedTime}</p>
            <p> <b> Cook Time: </b> {cookTime}</p>
            <p> <b> Makes </b> {sevings} servings</p>
            <br></br>

            <div className="recipe-section"> 
              <p> <b> Ingredients: </b></p>
              <div>
                {generatedIngredients.map((ingredient, index) => (
                  <p key={index} style={{ marginLeft: '20px' }}>{ingredient}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="generated-container-right">
            <div className="recipe-section"> 
              <p id="directions-title">Directions:</p>
              <div>
                {instructions.map((instruction, index) => (
                  <p key={index} style={{ marginLeft: '20px' }}>{instruction}</p>
                ))}
              </div>
            </div>
          </div>
      
         
        </div>
      </div>
      )}
      
    </div>
  );
}

export default Home;






























          {/* <div>
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
           </div>  */}

      {/* </div> */}