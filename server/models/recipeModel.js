const pool = require('./db');
const stringSimilarity = require('string-similarity');
const crypto = require('crypto');

class recipeModel {

	static async getAllRecipes(table) {
		const query = `SELECT * FROM ${table}`;
		const result = await pool.query(query);

		// console.log("Database:", result.rows);
		return result.rows;
	}

	// since ranked by similarity, if pressed try again, maybe get the second ranked, such as queue system
	static async getByIngredients(ingredients) {

		var recipeTable;

		const firstIngredient = ingredients[0];
		const lastIngredient = ingredients[ingredients.length -1];

		const firstCharacter = firstIngredient[0];
		const lastCharacter = lastIngredient[0];

		if((firstCharacter >= 'a' && firstCharacter <= 'm') && (lastCharacter >= 'a' && lastCharacter <= 'm')){
			recipeTable = 'recipes';
		}
		else if((firstCharacter >= 'n' && firstCharacter <= 'z') && (lastCharacter >= 'n' && lastCharacter <= 'z')){
			recipeTable = 'recipes2';
		}else{
			// its in both databases so check whichever
			recipeTable = 'recipes';
		}

	    const allRecipes = await recipeModel.getAllRecipes(recipeTable);

	    // Use a similarity threshold to control the degree of matching
	    var similarityThreshold = 0.85;
	    if(ingredients.length <= 4){
	    	similarityThreshold = 70;
	    }

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


	static async insert(recipeData, userIngredients, table) {
		try {
			const recipeObject = JSON.parse(recipeData);

			const unique_hash = recipeModel.generateRandHash(userIngredients[0], userIngredients[userIngredients.length -1]);

			const query = `
			INSERT INTO ${table} (uid, title, prep_time, cook_time, servings, user_ingredients, ingredients, instructions)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
			RETURNING *`;

			const values = [
				unique_hash,
				recipeObject.title,
				recipeObject.prep_time,
				recipeObject.cook_time,
				recipeObject.servings,
				userIngredients,
				recipeObject.ingredients,
				recipeObject.instructions
			];

			const result = await pool.query(query, values);
			console.log(`Inserted into the ${table} database:`, result.rows[0]);

			return result.rows[0];
		} catch (error) {
		  console.error("Error inserting recipe into the database:", error);
		  throw error;
		}

	}

	static async new_insert(recipeData, userIngredients) {
		try {
			const firstIngredient = userIngredients[0];
			const lastIngredient = userIngredients[userIngredients.length -1];

			const firstCharacter = firstIngredient[0];
			const lastCharacter = lastIngredient[0];

			if((firstCharacter >= 'a' && firstCharacter <= 'm') && (lastCharacter >= 'a' && lastCharacter <= 'm')){
				recipeModel.insert(recipeData, userIngredients, 'recipes');
			}
			if((firstCharacter >= 'n' && firstCharacter <= 'z') && (lastCharacter >= 'n' && lastCharacter <= 'z')){
				recipeModel.insert(recipeData, userIngredients, 'recipes2');
			}

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


	static async generateRandHash(firstWord, lastWord) {
		// first and last word + time to generate unique hash
		const dataToHash = `${firstWord}-${lastWord}-${Date.now()}`;

		// generate sha256 hash
		const uniqueHash = crypto.createHash('sha256').update(dataToHash).digest('hex');
		return uniqueHash;
	}

}

module.exports = recipeModel;
