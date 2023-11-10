
class userModel {

	static async findUser(userObject) {
	    try {
	        // Query the database to find the user based on the user_key
	        const query = `
	            SELECT user_key, rate_limiter, user_recipes
	            FROM users
	            WHERE user_key = $1
	        `;
	        const values = [userObject.sub];

	        const result = await pool.query(query, values);

	        // Check if a user was found
	        if (result.rows.length > 0) {
	            // User found, return user data
	            const user = result.rows[0];
	            return user;
	        } else {
	        	const newUser = await userModel.insertUser(userObject.name, userObject.email, userObject.sub)
	            return newUser;
	        }
	    } catch (error) {
	        console.error("Error finding user in the database:", error);
	        throw error;
	    }
	}



	static async insertUser(name, email, key) {
		try {
			const query = `
				INSERT INTO users (user_name, user_email, user_key)
				VALUES ($1, $2, $3)
				RETURNING user_key, rate_limiter, user_recipes;
			`;

			const values = [
				name,
				email,
				key
			];

			const result = await pool.query(query, values);
			console.log("Inserted user into the database:", result.rows[0]);
			return result.rows[0];

		} catch (error) {
			console.error("Error inserting user into the database:", error);
			throw error;
		}
	}

	static async saveRecipe(userObject, recipe_uid) {
	    try {
	        // Check if the recipe_uid already exists in the user's user_recipes array in the db
	        const checkQuery = `
	            SELECT user_recipes
	            FROM users
	            WHERE user_key = $1;
	        `;
	        const checkValues = [userObject.sub];

	        const checkResult = await pool.query(checkQuery, checkValues);
	        const userRecipes = checkResult.rows[0].user_recipes || [];

	        if (!userRecipes.includes(recipe_uid)) {
	            // If the recipe_uid is not already in the array, proceed with the update
	            const query = `
	                UPDATE users
	                SET user_recipes = array_append(user_recipes, $1)
	                WHERE user_key = $2;
	            `;
	            const values = [recipe_uid, userObject.sub];

	            const result = await pool.query(query, values);
	            console.log("Saved recipe into the database:", result.rows[0]);
	            return result.rows[0];
	        } else {
	            console.log("Recipe ID already exists in the user_recipes array. Not adding duplicate.");
	            return null;
	        }
	    } catch (error) {
	        console.error("Error saving recipe into the database:", error);
	        throw error;
	    }
	}


	static async unsaveRecipe(userObject, recipe_uid) {
	    try {
	        const query = `
	            UPDATE users
	            SET user_recipes = array_remove(user_recipes, $1)
	            WHERE user_key = $2;
	        `;
	        const values = [recipe_uid, userObject.sub];

	        const result = await pool.query(query, values);
	        console.log("Unsaved recipe from the database:", result.rows[0]);
	        return result.rows[0];
	    } catch (error) {
	        console.error("Error unsaving recipe from the database:", error);
	        throw error;
	    }
	}

	// make a post route that contains the users_recipes and returns all saved recipes in json
	static async allSavedRecipes(user_recipes) {
		const recipes = [];

		for (const uid of user_recipes) {
			// Try to find the recipe in the 'recipes' table
			const recipeFromRecipes = await pool.oneOrNone(
				'SELECT title, prep_time, cook_time, servings, ingredients, instructions ' +
				'FROM recipes WHERE uid = $1', uid
			);

			if (recipeFromRecipes) {
				recipes.push(recipeFromRecipes);
			} else {
				// If not found in 'recipes', try to find in 'recipes2'
				const recipeFromRecipes2 = await pool.oneOrNone(
					'SELECT title, prep_time, cook_time, servings, ingredients, instructions ' +
					'FROM recipes2 WHERE uid = $1', uid
				);

			  if (recipeFromRecipes2) {
			  	recipes.push(recipeFromRecipes2);
			  }
			}
		}
		const recipesJSON = JSON.stringify(recipes);

		return recipesJSON;
	}



}

module.exports = userModel;