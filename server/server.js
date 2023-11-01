const express = require('express');
const path = require('path');
const cors = require('cors');
// const recipeRoutes = require('./routes/recipeRoutes');
const recipeController = require('./controllers/recipeController');
const recipeModel = require('./models/recipeModel');
const ingredientModel = require('./models/ingredientModel');

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

	// grab ingredients and time from post request
	const { prepTime, ingredients } = req.body;

	// check if users ingredients are valid
	const validIngredients = await ingredientModel.validIngredients(ingredients);
	if(validIngredients != true){
		// display error to user that ingredient(s) not valid
		// end function
		res.json({recipe: null})
	}

	ingredients.sort();
	console.log(ingredients);

	const matchingRecipe = await recipeModel.getByIngredients(ingredients);

	if(matchingRecipe != null){
		console.log("Retrieving matching Recipe!");

		const jsonMatchingRecipe = JSON.stringify(matchingRecipe);
		res.json({recipe: jsonMatchingRecipe});
	}else{
		console.log("Didn't retrieve from database");
		// use prompt engineering to generate the recipe using the ingredients and time
		const generatedPrompt = await recipeController.generatePrompt(prepTime, ingredients);

		// after getting the prompt, call openai api to send api request to get recipe. 
		const generatedRecipe = await recipeController.generateRecipe(generatedPrompt);

		// store generated recipe to database, since matching recipe not found
		const add = await recipeModel.new_insert(generatedRecipe, ingredients);

		console.log({recipe: generatedRecipe});

		// return chatgpt response to user
		res.json({ recipe: generatedRecipe });
	}
	

});




app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));