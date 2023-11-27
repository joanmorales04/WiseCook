const express = require('express');
const path = require('path');
const cors = require('cors');
// const recipeRoutes = require('./routes/recipeRoutes');
const recipeController = require('./controllers/recipeController');
const recipeModel = require('./models/recipeModel');
const ingredientModel = require('./models/ingredientModel');
const userModel = require('./models/userModel');

PORT=8080;

// Serve the React app
const app = express();
app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.json());


// Handle the login page route
app.get('/', (req, res) => {
  // Send the login page HTML or render the login component here
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Handle the main app page route (this should come after the other routes)
app.get('/home', (req, res) => {
  // Send the main app page HTML or render the main app component here
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.get('/recipes', (req, res) => {
	// talk to database
});


// Handle other routes or API endpoints here
app.post('/recipe', async (req, res) => {
	try {
		// grab ingredients and time from post request
		const { prepTime, ingredients } = req.body;

		// gets checked by UI first, so ingredients should be valid

		// // check if users ingredients are valid
		// const validIngredients = await ingredientModel.validIngredients(ingredients);
		// if(validIngredients != true){
		// 	// display error to user that ingredient(s) not valid
		// 	// end function
		// 	res.json({recipe: null})
		// }

		ingredients.sort();
		console.log(ingredients);

		// check for bad ingredients by sanitizing ingredients
		const sanitizedIngredients = ingredients.map(ingredient => ingredient.replace(/[^a-zA-Z0-9_\s]/g, ''));

		const matchingRecipe = await recipeModel.getByIngredients(sanitizedIngredients);

		if(matchingRecipe != null){
			console.log("Retrieved matching Recipe!");

			const jsonMatchingRecipe = JSON.stringify(matchingRecipe);
			res.json({recipe: jsonMatchingRecipe});
		}else{
			console.log("Didn't retrieve from database");
			// use prompt engineering to generate the recipe using the ingredients and time
			const generatedPrompt = await recipeController.generatePrompt(prepTime, ingredients);

			// after getting the prompt, call openai api to send api request to get recipe. 
			const generatedRecipe = await recipeController.generateRecipe(generatedPrompt);

			// store generated recipe to database, since matching recipe not found
			var newGeneratedRecipe = await recipeModel.new_insert(generatedRecipe, ingredients);
			newGeneratedRecipe = JSON.stringify(newGeneratedRecipe);

			// return chatgpt response to user
			res.json({ recipe: newGeneratedRecipe });
		}
   } catch (error) {
		console.error('Error processing recipe request:', error);
		res.status(500).json({ error: 'Internal Server Error' });
   }

});

app.post('/regenerate', async (req, res) => {
	const { prepTime, ingredients } = req.body;

	ingredients.sort();

	// use prompt engineering to generate the recipe using the ingredients and time
	const generatedPrompt = await recipeController.regeneratePrompt(prepTime, ingredients);

	// after getting the prompt, call openai api to send api request to get recipe. 
	const generatedRecipe = await recipeController.generateRecipe(generatedPrompt);

	// store generated recipe to database, since matching recipe not found
	var newGeneratedRecipe = await recipeModel.new_insert(generatedRecipe, ingredients);
	newGeneratedRecipe = JSON.stringify(newGeneratedRecipe);

	// console.log({recipe: newGeneratedRecipe});

	// return chatgpt response to user
	res.json({ recipe: newGeneratedRecipe });
});


app.post('/saverecipe', async (req, res) => {
	const { user_key, uid } = req.body;

    try {
        const save = await userModel.saveRecipe(user_key, uid);

        if(save) {
            res.status(200).send('Recipe saved successfully');
        }else {
            res.status(500).send('Error saving recipe');
        }
	} catch(error) {
		console.error('Error saving recipe:', error);
		res.status(500).send('Internal Server Error');
	}


});


app.post('/unsaverecipe', async (req, res) => {
	const { user_key, uid } = req.body;

    try {
        const unSave = await userModel.unsaveRecipe(user_key, uid);

        if(save) {
            res.status(200).send('Recipe unsaved successfully');
        }else {
            res.status(500).send('Error unnsaving recipe');
        }
	} catch(error) {
		console.error('Error unsaving recipe:', error);
		res.status(500).send('Internal Server Error');
	}
});


app.get('/allsavedrecipes', async (req, res) => {
	const { user_recipes } = req.body;
    try {
        if (!user_recipes) {
            return res.status(400).json({ error: 'user_recipes parameter is missing.' });
        }

        // Parse the user_recipes parameter into an array
        const userRecipesArray = JSON.parse(user_recipes);

        // Call the allSavedRecipes function
        const recipesJSON = await userModel.allSavedRecipes(userRecipesArray);

        res.json({ recipes: recipesJSON });
    } catch (error) {
        console.error('Error fetching saved recipes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/imagetorecipe', async (req, res) => {
	const { image_name } = req.body;

	const generateRecipe = await visionController.generateRecipeFromImage(`./${image_name}`);

	res.json({ recipe: generateRecipe });
});



app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));