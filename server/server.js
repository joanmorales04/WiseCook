const express = require('express');
const path = require('path');
const cors = require('cors');
// const recipeRoutes = require('./routes/recipeRoutes');
const recipeController = require('./controllers/recipeController');
const recipeModel = require('./models/recipeModel');
const ingredientModel = require('./models/ingredientModel');
const userModel = require('./models/userModel');
const visionController = require('./controllers/visionController');


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

app.post('/login', async (req, res) => {
	try {
		const { userObject } = req.body;

		var userData = await userModel.findUser(userObject);
		userData = JSON.stringify(userData);

		res.json({ user: userData });

	} catch (error) {
		console.error('Error loggin in:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});


// Handle other routes or API endpoints here
app.post('/recipe', async (req, res) => {
	try {
		// grab ingredients and time from post request
		const { prepTime, ingredients, user } = req.body;

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
			if(user.rate_limiter != 0){
				console.log("Didn't retrieve from database");

				// use prompt engineering to generate the recipe using the ingredients and time
				const generatedPrompt = await recipeController.generatePrompt(prepTime, ingredients);

				// after getting the prompt, call openai api to send api request to get recipe
				const generatedRecipe = await recipeController.generateRecipe(generatedPrompt);

				// store generated recipe to database, since matching recipe not found
				var newGeneratedRecipe = await recipeModel.new_insert(generatedRecipe, ingredients);
				// newGeneratedRecipe = JSON.stringify(newGeneratedRecipe);

				// decrease rate limit by 1
				const limitUser = await userModel.decreaseRateLimiter(user);

				// return chatgpt response to user
				res.json({ recipe: newGeneratedRecipe, user: limitUser.user });
			}else {
				res.json({recipe: null, user: user});
			}
		}
   } catch (error) {
		console.error('Error processing recipe request:', error);
		res.status(500).json({ error: 'Internal Server Error' });
   }

});

app.post('/regenerate', async (req, res) => {
	const { prepTime, ingredients, user } = req.body;

	ingredients.sort();

	try {
		if(user.rate_limiter != 0){
			// use prompt engineering to generate the recipe using the ingredients and time
			const generatedPrompt = await recipeController.regeneratePrompt(prepTime, ingredients);

			// after getting the prompt, call openai api to send api request to get recipe. 
			const generatedRecipe = await recipeController.generateRecipe(generatedPrompt);

			// store generated recipe to database, since matching recipe not found
			var newGeneratedRecipe = await recipeModel.new_insert(generatedRecipe, ingredients);

			const limitUser = await userModel.decreaseRateLimiter(user);

			// return chatgpt response to user
			res.json({ recipe: newGeneratedRecipe, user: limitUser.user });
		} else {
			res.json({ recipe: null, user: user });
		}

    } catch (error) {
        console.error('Error in regeneration process:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});


app.post('/imagetorecipe', async (req, res) => {
	const { image_buffer, user } = req.body;

	try {
		if(user.rate_limiter != 0) {
			const generateRecipe = await visionController.generateRecipeFromImage(image_buffer);

			const limitUser = await userModel.decreaseRateLimiter(user);

			res.json({ recipe: generateRecipe, user: limitUser.user });
		} else {
			res.json({ recipe: null, user: user });
		}
		
	} catch(error) {
        console.error('Error in processing image:', error);
        res.status(500).json({ error: 'Internal Server Error' });
	}

});


app.post('/saverecipe', async (req, res) => {
	const { user_key, recipeID } = req.body;

    try {
        const save = await userModel.saveRecipe(user_key, recipeID);

        if(save.success) {
            res.status(200).json({
                message: 'Recipe saved successfully',
                user: save.user
            });
        }else {
            res.status(500).json({
                message: 'Error saving recipe',
                user: null
            });
        }
	} catch(error) {
		console.error('Error saving recipe:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            user: null
        });
	}

});


app.post('/unsaverecipe', async (req, res) => {
	const { user_key, recipeID } = req.body;

    try {
        const unSave = await userModel.unsaveRecipe(user_key, recipeID);

        if(unSave.success) {
            res.status(200).json({
                message: 'Recipe unsaved successfully',
                user: unSave.user
            });
        }else {
            res.status(500).json({
                message: 'Error unsaving recipe',
                user: null
            });
        }
	} catch(error) {
		console.error('Error unsaving recipe:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            user: null
        });
	}
});


app.get('/allsavedrecipes', async (req, res) => {
	const { user } = req.body;
    try {

        const recipesJSON = await userModel.allSavedRecipes(user);

        res.status(200).json({ recipes: recipesJSON });
    } catch (error) {
        console.error('Error fetching saved recipes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// app.post('/updateratelimit', async (req, res) => {
//     try {
//         const { user } = req.body;

//         const updatedUser = await userModel.decreaseRateLimiter(user);

//         if (updatedUser.success) {
//             res.status(200).json({
//                 message: 'Rate limiter decreased successfully',
//                 user: updatedUser.user
//             });
//         } else {
//             res.status(404).json({
//                 message: 'User not found. Rate limiter not decreased.',
//                 user: null
//             });
//         }
//     } catch (error) {
//         console.error('Error updating rate limiter:', error);
//         res.status(500).json({
//             message: 'Internal Server Error',
//             user: null
//         });
//     }
// });



app.get('/ingredients', async (req, res) => {
	try {
		var allIngredients = await ingredientModel.getAllIngredients();
		allIngredients = JSON.stringify(allIngredients);

		res.json({ingredients: allIngredients});
	} catch(error) {
		console.error('Error retrieving all valid ingredients:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}

});


app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));