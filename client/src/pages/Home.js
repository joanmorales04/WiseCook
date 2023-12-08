import jwt_decode from 'jwt-decode';
import React, { useState, useEffect} from 'react';
import Login from './Login'; // Import Login from the parent directory
import '../App.css'; // Import App.css from the parent directory
import Navbar from '../navigation/Navbar';
import Hero from '../navigation/Hero';
import ingredientsData from '../ingredients.json'; 


function Home({user, setUser, handleSignOut}) {

  // Tab and Image handlers
  const [selectedTab, setSelectedTab] = useState('text'); 
  const [imageAdded, setImageAdded] = useState(false);
  const [baseImage, setBaseImage] = useState("");
  const [baseImageDisplay, setBaseImageDisplay] = useState("");
 

  // Ingredient JSON file
  const [ingredientList, setIngredientList] = useState([]);
  const [suggestedIngredients, setSuggestedIngredients] = useState([]);
  const [suggestionSelected, setSuggestionSelected] = useState(false);

 
  // User input
  const [selectedPrepTime, setSelectedPrepTime] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  

  // Variables received from generated recipes
  const [title, setTitle] = useState();
  const [generatedTime, setGeneratedTime] = useState();
  const [cookTime, setCookTime] = useState();
  const [sevings, setServings] = useState();
  const [generatedIngredients, setGeneratedIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [recipe_id, setRecipeID] = useState();


  // Submit buttons
  const [submitted, setSubmitted] = useState(false);
  const [submittedImage, setSubmittedImage] = useState(false);


  const [loading, setLoading] = useState(false);


  const [isRecipeSaved, setIsRecipeSaved] = useState(false);
  const [isRecipeDeleted, setIsRecipeDeleted] = useState(false);

  // If user_limiter is exceeded
  const [showMessage, setShowMessage] = useState(false);





  // Image needed to display
  const displayImage = async (e) => {
    const fileDisplay = e.target.files[0];
    const base64Display = await convertBase64(fileDisplay);
    setBaseImageDisplay(base64Display);    
  }

  // Image needed for recipe
  const uploadImage = async (e) => {
    const file = e.target.files[0];
  
    // Create a FileReader to read the file
    const fileReader = new FileReader();
  
    fileReader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        // Set the canvas size to the desired dimensions (e.g., 150x150)
        canvas.width = 150;
        canvas.height = 150;
  
        // Draw the image on the canvas, resizing it
        ctx.drawImage(img, 0, 0, 150, 150);
  
        // Get the base64-encoded data URL from the canvas
        const base64 = canvas.toDataURL('image/jpeg'); // You can use 'image/png' for PNG format
  
        // Update the state with the resized base64 image
        setBaseImage(base64);
      };
  
      // Set the source of the image to the FileReader result (base64)
      img.src = event.target.result;
    };
  
    // Read the file as a data URL (base64)
    fileReader.readAsDataURL(file);
  };
  



  // Convert image to base64 
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const handleDeleteIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleInputChange = (event, index) => {
    const { value } = event.target;
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
    setSuggestionSelected(false); // User is typing, not selecting a suggestion
  
    const filteredIngredients = ingredientList
      .filter((ingredient) => ingredient.name.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 4);
  
    const updatedSuggestedIngredients = { ...suggestedIngredients };
    updatedSuggestedIngredients[index] = filteredIngredients;
    setSuggestedIngredients(updatedSuggestedIngredients);
  };

  const handleSelectSuggestion = (selectedIngredient, index) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = selectedIngredient.name;
    setIngredients(newIngredients);

    const updatedSuggestedIngredients = { ...suggestedIngredients };
    updatedSuggestedIngredients[index] = [];
    setSuggestedIngredients(updatedSuggestedIngredients);
    setSuggestionSelected(false);
  };

  useEffect(() => {
    const fetchIngredients = () => {
      try {
        const excludedPrefixes = [
          'fr:', 'es:', 'bg:', 'th:', 'la:', 'it:', 'pt:', 'id:', 'ro:', 'ja:',
          'nl:', 'hu:', 'sr:', 'sv:', 'nb:', 'cs:', 'ru:', 'da:', 'el:', 'zh:',
          'sl:', 'fi:', 'so:', 'az:', 'tr:', 'pl:', 'ar:', 'lt:', 'de:'
        ];

        const lowercasedIngredients = (ingredientsData?.tags || []).map(ingredient => ({
          ...ingredient,
          name: ingredient.name.toLowerCase(),
        }));

        const filteredIngredients = lowercasedIngredients.filter(ingredient => (
          !excludedPrefixes.some(prefix => ingredient.name.startsWith(prefix)) &&
          !/\d/.test(ingredient.name)
        ));

        setIngredientList(filteredIngredients);
      } catch (error) {
        console.error('Error loading ingredients from JSON file', error);
      }
    };

    fetchIngredients();
  }, []);

  const handleDecrementLimiter = async () => {
    try {
      const response = await fetch('http://localhost:8080/updateratelimit', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      
        body: JSON.stringify({ user: user }),
      });
  
      if (response.ok) {
        const receivedRecipe = await response.json();

        setUser(receivedRecipe.user);
  
        // console.log('Limited decremented successfully:', user.rate_limiter);
      } else {
        console.error('Failed to decrement the limiter:');
      }
    } catch (error) {
      console.error('An error occurred while decrementing the limiter:', error);
    }
  }; 


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (user.rate_limiter === 0) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000); 
      return;
    }

    setLoading(true);
  
    // Constructing the payload to be sent to the server
    const payload = {
      prepTime: selectedPrepTime,
      ingredients,
      mealType: selectedMealType,
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

        if (receivedRecipe.message === 'new') {
          await handleDecrementLimiter();
        }

        const recipeObject = JSON.parse(receivedRecipe.recipe);

        setTitle(recipeObject.title);
        setGeneratedTime(recipeObject.prep_time);
        setCookTime(recipeObject.cook_time);
        setServings(recipeObject.servings);
        setGeneratedIngredients(recipeObject.ingredients);
        setInstructions(recipeObject.instructions);
        setRecipeID(recipeObject.uid);

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

 
  const handleSaveRecipe = async () => {
    const recipeToSave = {
      user_key: user,
      recipeID: recipe_id,
    };
  
    try {
      const response = await fetch('http://localhost:8080/saverecipe', { // Replace with the actual endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      
        body: JSON.stringify(recipeToSave),
      });
  
      if (response.ok) {
        const savedRecipeResponse = await response.json();
        const updatedUser = savedRecipeResponse.user;


        // console.log("this is the update user: ", updatedUser);

        if(updatedUser != null)
        {
          setUser(updatedUser);
        }
      
        // If the save is successful, handle the response. Maybe set a state to indicate the recipe is saved.
        setIsRecipeSaved(true); 
        setIsRecipeDeleted(false);
       
        // console.log('Recipe saved successfully:', savedRecipeResponse);
      } else {
        console.error('Failed to save the recipe:', await response.text());
      }
    } catch (error) {
      console.error('An error occurred while saving the recipe:', error);
    }
  };  


  const handleDeleteRecipe = async () => {
    try {
      const response = await fetch('http://localhost:8080/unsaverecipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',    
        },
        body: JSON.stringify({ user_key: user, recipeID: recipe_id }),
      });

      if (response.ok) {

        const deleteRecipeResponse = await response.json();
        const updatedUserRecipeDeleted = deleteRecipeResponse.user;

        if(updatedUserRecipeDeleted != null)
        {
          setUser(updatedUserRecipeDeleted);
        }

        // console.log('Recipe deleted successfully');
        setIsRecipeSaved(false);
        setIsRecipeDeleted(true); 
      } else {
        throw new Error('Failed to delete the recipe');
      }
    } catch (error) {
      console.error('An error occurred while deleting the recipe:', error);
    }
  };

  const handleSubmitImage = async (event) => {
    event.preventDefault();

    if (user.rate_limiter === 0) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000); 
      return;
    }

    setLoading(true);
  
    // Constructing the payload to be sent to the server
    const payload = {
      image_buffer: baseImage,
    };
      
    try {
      // Making a POST request to the '/regenerate' endpoint
      const response = await fetch('http://localhost:8080/imagetorecipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {

        // Parse the response JSON
        const receivedImageRecipe = await response.json();

        // Parse the recipe
        const newRecipe = JSON.parse(receivedImageRecipe.recipe);

        // Access and clean the content
        const recipeContent = newRecipe.choices[0]?.message?.content;
        const cleanedRecipeContent = recipeContent.replace(/^```json/, '').replace(/```$/, '');

        // Parse the response content JSON
        const recipeObject = JSON.parse(cleanedRecipeContent);

        setTitle(recipeObject.title);
        setGeneratedTime(recipeObject.prep_time);
        setCookTime(recipeObject.cook_time);
        setServings(recipeObject.servings);
        setGeneratedIngredients(recipeObject.ingredients);
        setInstructions(recipeObject.instructions);

        await handleDecrementLimiter();

        setSubmittedImage(true);

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


  const generateNewRecipe = async () => {
    // Ensure this function is not called before handleSubmit has been successfully executed
    if (user.rate_limiter === 0) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000); 
      return;
    }

    if (!submitted) {
      console.error('You must generate an initial recipe before requesting a new one.');
      return;
    }
  
    // Set loading to true before the request starts
    setLoading(true);
  
    const payload = {
      prepTime: selectedPrepTime,
      ingredients,
      mealType: selectedMealType,
      // excludeTitle: recipeTitle, // Uncomment if the server needs this
    };
  
    try {
      // Making a POST request to the '/regenerate' endpoint
      const response = await fetch('http://localhost:8080/regenerate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const newRecipeResponse = await response.json();
   
        // Assuming the server's response structure is as expected
        const newRecipe = JSON.parse(newRecipeResponse.recipe);
  
        // Update the states with the new recipe information
        setTitle(newRecipe.title);
        setGeneratedTime(newRecipe.prep_time);
        setCookTime(newRecipe.cook_time);
        setServings(newRecipe.servings);
        setGeneratedIngredients(newRecipe.ingredients);
        setInstructions(newRecipe.instructions);

        await handleDecrementLimiter();
  
        // Set submitted to true to show the recipe
        setSubmitted(true);
      } else {
        // If the server response is not OK, log the error message
        console.error('Failed to generate new recipe:', await response.text());
      }
    } catch (error) {
      // Log any error that occurs during the fetch operation
      console.error('An error occurred while generating a new recipe:', error);
    } finally {
      // Set loading to false after the request is completed
      setLoading(false);
    }
  };  

  // console.log("This is the recipes list: " + ingredients);



  return (
    <div className="App"> 

      <Navbar user={user} handleSignOut={handleSignOut} />

      <Hero 
      cName="hero" 
      title="Home"
      >
      </Hero>

      <div className="tabs">
        <button
          className={selectedTab === 'text' ? 'selectedTab' : 'notselectedTab'}
          onClick={() => handleTabChange('text')}
        >
          Ingredients to Recipe
        </button>
        <button
          className={selectedTab === 'image' ? 'selectedTab' : 'notselectedTab'}
          onClick={() => handleTabChange('image')}
        >
          Image to Recipe
        </button>
      </div>

      {/* Text to Recipe */}
      {selectedTab === 'text' && (
        <div className="app-container">

          <div className="app-container-left">
            <p className= "app-container-headers"> Select a preparation time: </p>
            <div className="prep-time-buttons-container"> 
              <button
                className={`prep-time-button ${selectedPrepTime === '15' ? 'selectedPrepTime' : ''}`}
                onClick={() => setSelectedPrepTime('15')} >
                15 min
              </button>
              <button
                className={`prep-time-button ${selectedPrepTime === '30' ? 'selectedPrepTime' : ''}`}
                onClick={() => setSelectedPrepTime('30')}>
                30 min
              </button>
              <button
                className={`prep-time-button ${selectedPrepTime === '45' ? 'selectedPrepTime' : ''}`}
                onClick={() => setSelectedPrepTime('45')}>
                45 min
              </button>
              <button
                className={`prep-time-button ${selectedPrepTime === '60' ? 'selectedPrepTime' : ''}`}
                onClick={() => setSelectedPrepTime('60')}>
                60 min
              </button>
            </div>
            <br></br>
            <br></br>
      
            <p className= "app-container-headers"> Select a type of meal: </p>
            <div className="meal-type-buttons-container">
              <button
                className={`meal-type-button ${selectedMealType === 'breakfast' ? 'selectedMealType' : ''}`}
                onClick={() => setSelectedMealType('breakfast')} >
                Breakfast
              </button>
              <button
                className={`meal-type-button ${selectedMealType === 'lunch' ? 'selectedMealType' : ''}`}
                onClick={() => setSelectedMealType('lunch')}>
                Lunch
              </button>
              <button
                className={`meal-type-button ${selectedMealType === 'dinner' ? 'selectedMealType' : ''}`}
                onClick={() => setSelectedMealType('dinner')}>
                Dinner
              </button>
            </div>
          </div>
      
      
      
          <div className="app-container-right">
          <p className="app-container-headers"> Enter ingredients: </p>
              
          {ingredients.map((ingredient, index) => (
        <div key={index} className="ingredient-input-container">
          <div className="input-container">
          <input
            type="text"
            value={ingredient}
            onChange={(e) => handleInputChange(e, index)}
            onBlur={() => {
              if (!suggestionSelected) {
                // If no suggestion was selected, set the ingredient to an empty string
                const newIngredients = [...ingredients];
                newIngredients[index] = '';
                setIngredients(newIngredients);
              }
            }}
            placeholder="Enter ingredient..."
            style={{ display: 'inline-block', margin: '0 auto', marginBottom: '10px' }}
          />

          <button
            className="delete-ingredient-button"
            onClick={() => handleDeleteIngredient(index)}
          >
            X
          </button>
         </div>

          {!suggestionSelected && suggestedIngredients[index]?.length > 0 && (
            <div className="suggestions-container">
              <ul className="suggestions">
                {suggestedIngredients[index].map((ingredient) => (
                  <li key={ingredient.id} onClick={() => handleSelectSuggestion(ingredient, index)}>
                    {ingredient.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}


        <button id="ingredient-button" type="button" onClick={handleAddIngredient}>
            Add Ingredient
          </button>
        </div>
        </div>
        
      )}


      {/* image to text */}
      {selectedTab === 'image' && (
        <div className="app-container">
          <div className="app-container-left">
            <p className="app-container-headers">How it works</p>
            <p>Attach an image of a meal and click submit to generate the recipe</p>
          </div>

          <div className="app-container-right">

            {!imageAdded && (
              <p className="app-container-headers">Add Image</p>
            )}
            {imageAdded && (
              <p className="app-container-headers">Image Added</p>
            )}

            <input
              className= "image-input"
              type="file"
              onChange = {(e) => {
                setImageAdded(true);
                uploadImage(e);
                displayImage(e);
              }}
            >
            </input>

            <img className="imageToRecipeImage" src={baseImageDisplay}/>
          </div>
        </div>
      )}

       
      {selectedTab === 'text' && (
        <div className="submit-container">
        <button className="submit-button" type="button" onClick={handleSubmit}>Submit</button>
      </div>
      )}

      {selectedTab === 'image' && (
        <div className="submit-container">
        <button className="submit-button" type="button" onClick={handleSubmitImage}> Submit</button>
      </div>
      )}



      {loading && <p className="processing-message">Processing...</p>}

      {showMessage && (
        <div className="error-message">
          Sorry, you are out of credits for today. Please come back tomorrow.
        </div>
      )}

      
      {submitted  && selectedTab === 'text' && (
        <div className="generated-recipe-container"> 
          <h3>Generated Recipe:</h3>
          <br></br>
          <b id="generated-recipe-title">{title}</b>

        <div className="recipe-container">
          <div className="generated-container-left">
            <p> <b> Preparation Time: </b> {generatedTime}</p>
            <p> <b> Cook Time: </b> {cookTime}</p>
            <p> <b> Makes </b> {sevings} <b>servings</b></p>
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
        <div className="button-container-a">


          {!isRecipeSaved && (
             <button className="save-recipe-button" onClick={handleSaveRecipe}>Save Recipe</button>
          )}

          {isRecipeSaved && !isRecipeDeleted && (
            <button className="unsave-recipe-button" onClick={handleDeleteRecipe}>Unsave Recipe</button>
          )}


          <button className="generate-recipe-button" onClick={generateNewRecipe}>Generate New Recipe</button>
        </div>
      </div>
      )}


      {submittedImage  && selectedTab === 'image' && (
        <div className="generated-recipe-container"> 
          <h3>Generated Recipe:</h3>
          <br></br>
          <b id="generated-recipe-title">{title}</b>
        

        <div className="recipe-container">
          <div className="generated-container-left">
            <p> <b> Preparation Time: </b> {generatedTime}</p>
            <p> <b> Cook Time: </b> {cookTime}</p>
            <p> <b> Makes </b> {sevings} <b>servings</b></p>
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
        <div className="button-container-a">


        </div>
      </div>
      )}

      
    </div>
  );
}

export default Home;