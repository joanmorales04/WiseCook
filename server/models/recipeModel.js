const pool = require('./db');
const stringSimilarity = require('string-similarity');

class recipeModel {

	static async getAllRecipes() {
		const query = 'SELECT * FROM recipes';
		const result = await pool.query(query);

		// console.log("Database:", result.rows);
		return result.rows;
	}
	// since ranked by similarity, if pressed try again, maybe get the second ranked, such as queue system

	static async getByIngredients(ingredients) {
	    const allRecipes = await recipeModel.getAllRecipes();

	    // Use a similarity threshold to control the degree of matching
	    const similarityThreshold = 0.85;

	    const ranking = [];

	    for (const recipe of allRecipes) {
	      const recipeIngredients = recipe.user_ingredients;
	      const matches = stringSimilarity.findBestMatch(ingredients.join(' '), [recipeIngredients.join(' ')]);
	      const bestMatch = matches.ratings.reduce((max, rating) => (rating.rating > max ? rating.rating : max), 0);

	      if (bestMatch >= similarityThreshold) {
	        ranking.push({ recipe, rank: bestMatch });
	      }
	    }

	    // Sort the ranking array in descending order of rank 
	    ranking.sort((a, b) => b.rank - a.rank);

	    // Check if there are any matching recipes
	    if (ranking.length === 0) {
	      return null; // No matching recipes found
	    }

	    // Select the highest ranked recipe (the first element in the ranking array)
	    const highestRankedRecipe = ranking[0].recipe;

	    return highestRankedRecipe;
	}


	static async insert(recipeData, userIngredients) {
		try {
			const recipeObject = JSON.parse(recipeData);

			const query = `
			INSERT INTO recipes (title, prep_time, cook_time, servings, user_ingredients, ingredients, instructions)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
			RETURNING *`;

			const values = [
				recipeObject.title,
				recipeObject.prep_time,
				recipeObject.cook_time,
				recipeObject.servings,
				userIngredients,
				recipeObject.ingredients,
				recipeObject.instructions
			];

			const result = await pool.query(query, values);
			console.log("Inserted into the database:", result.rows[0]);

			return result.rows[0];
		} catch (error) {
		  console.error("Error inserting recipe into the database:", error);
		  throw error;
		}

	}

	static async deleteRecipeById(recipeId) {
		const query = 'DELETE FROM recipes WHERE id = $1';
		try {
			const result = await pool.query(query, [recipeId]);
			console.log(`Recipe with ID ${recipeId} deleted successfully.`);
			return true;
	  	} catch (error) {
		    console.error(`Error deleting recipe with ID ${recipeId}: ${error}`);
		    return false;
	  	}
	}

}

module.exports = recipeModel;
