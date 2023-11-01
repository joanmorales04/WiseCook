const pool = require('./db');

class ingredientModel {

	static async getAllIngredients() {
		const query = 'SELECT * FROM ingredients';
		const result = await pool.query(query);

		console.log("Database:", result.rows);
		return result.rows;
	}

	static async validIngreient(ingredient) {
		const query = `SELECT * FROM ingredients WHERE name LIKE lower('%${ingredient}%')`;

		const result = await pool.query(query);

		if (result.rows.length > 0) {
		    return true;
		} else {
		    return false;
		}
	}
	
	static async validIngredients(ingredients) {

		for (const ingredient of ingredients) {
			const lowerCaseIngredient = ingredient.toLowerCase();

			const isValid = await ingredientModel.validIngreient(lowerCaseIngredient);
			if(isValid == false){
				console.log(`User ingredient "${lowerCaseIngredient}" is not in the database.`);
				return false;
			}
		}
		return true;
	}


}


module.exports = ingredientModel;