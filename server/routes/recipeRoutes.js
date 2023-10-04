// handle incoming GET/POST requests 
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

router.post('/recipe', async (req, res) => {

	// grab ingredients and time from post request
	const { time, ingredients } = req.body;

	// use prompt engineering to generate the recipe using the ingredients and time
	const generatedPrompt = await recipeController.generatePrompt(time, ingredients);

	// after getting the prompt, call openai api to send api request to get recipe. 
	const generatedRecipe = await recipeController.generateRecipe(generatedPrompt);
	console.log(generatedRecipe)

	// return chatgpt response to front
	res.json({ recipe: generatedRecipe });
});

module.exports = router;