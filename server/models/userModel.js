const pool = require('./db');

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
				RETURNING  user_key, rate_limiter, user_recipes
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
	        const checkValues = [userObject.uid];

	        const checkResult = await pool.query(checkQuery, checkValues);
	        const userRecipes = checkResult.rows[0].user_recipes || [];

	        if (!userRecipes.includes(recipe_uid)) {
	            // If the recipe_uid is not already in the array, proceed with the update
	            const query = `
	                UPDATE users
	                SET user_recipes = array_append(user_recipes, $1)
	                WHERE user_key = $2
	                RETURNING *;
	            `;
	            const values = [recipe_uid, userObject.uid];

	            const result = await pool.query(query, values);

	            console.log("Saved recipe into the database:", result.rows[0]);
	            return true;
	        } else {
	            console.log("Recipe ID already exists in the user_recipes array. Not adding duplicate.");
	            return false;
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
	            WHERE user_key = $2
	            RETURNING *;
	        `;
	        const values = [recipe_uid, userObject.sub];
	        const result = await pool.query(query, values);

			if (result.rows.length === 0) {
				console.log("Recipe ID not found in the user_recipes array. Nothing to unsave.");
				return false; // Recipe ID not found
			}

	        console.log("Unsaved recipe from the database:", result.rows[0]);
	        return true;
	    } catch (error) {
	        console.error("Error unsaving recipe from the database:", error);
	        throw error;
	    }
	}

	// make a post route that contains the users_recipes and returns all saved recipes in json
	static async allSavedRecipes(user) {
		try {
		    const recipes = [];

		    if (user.user_recipes.length === 0) {
		        return JSON.stringify(recipes); // return empty list 
		    }

		    // Use a single query with the IN clause to fetchrecipes  from both tables
		    const query = `
		        SELECT title, prep_time, cook_time, servings, ingredients, instructions, uid
		        FROM recipes
		        WHERE uid IN ($1:csv)
		        UNION
		        SELECT title, prep_time, cook_time, servings, ingredients, instructions, uid
		        FROM recipes2
		        WHERE uid IN ($1:csv);
		    `;

		    const result = await pool.manyOrNone(query, [user.user_recipes]);

		    for (const recipe of result) {
		        recipes.push(recipe);
		    }

		    const recipesJSON = JSON.stringify(recipes);
		    return recipesJSON;
		} catch (error) {
		    console.error("Error fetching saved recipes from the database:", error);
		    throw error;
	    }
	}




}

module.exports = userModel;