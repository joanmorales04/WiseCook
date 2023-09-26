const express = require('express');
const path = require('path');
const cors = require('cors');
// const recipeRoutes = require('./routes/recipeRoutes.js');
const recipeController = require('./controllers/recipeController');

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


// Handle other routes or API endpoints here
app.post('/recipe', async (req, res) => {

	// grab ingredients and time from post request
	const { prepTime, ingredients } = req.body;

	// use prompt engineering to generate the recipe using the ingredients and time
	const generatedPrompt = await recipeController.generatePrompt(prepTime, ingredients);

	// after getting the prompt, call openai api to send api request to get recipe. 
	const generatedRecipe = await recipeController.generateRecipe(generatedPrompt);

	// return chatgpt response to front
	res.json({ recipe: generatedRecipe });
});



app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));