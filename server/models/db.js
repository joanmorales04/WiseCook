const Pool = require('pg').Pool;

const pool = new Pool({
	user: "postgres",
	password: "wc$1001",
	host: "35.232.17.107",
	port: 5432,
	database: "wisecook"
})

// async function getAllIngredients() {
// 	const query = 'SELECT * FROM recipes';
// 	const result = await pool.query(query);

// 	console.log("Database:", result.rows);
// 	return result.rows;
// }
// (async () => {
// 	const allIngred = await getAllIngredients();

// })();


// // testing function
// async function getAllRecipes() {
//   const query = 'SELECT * FROM recipes';
//   const result = await pool.query(query);

//   console.log("Database:", result.rows);
//   return result.rows;
// }

// (async () => {
//   const allRecipes = await getAllRecipes();
// })();

// // only needs to be ran once to get ingredients into db
// const fs = require('fs');

// async function insert_ingredients(ingredient) {
// 	try {
// 		const query = `
// 		INSERT INTO ingredients (name)
// 		VALUES ($1)
// 		RETURNING *`;

// 		const values = [
// 			ingredient
// 		];

// 		const result = await pool.query(query, values);
// 		console.log("Inserted into the ingredient database:", result.rows[0]);

// 		return result.rows[0];
// 	} catch (error) {
// 	  console.error("Error inserting recipe into the database:", error);
// 	  throw error;
// 	}
// }

// (async () => {
//     try {
//         const jsonString = await fs.promises.readFile('ingredients.json', 'utf8');
//         const data = JSON.parse(jsonString);

//         // Loop through the 'tags' array and access the 'name' property for each tag
//         for (const tag of data.tags) {
//         	const lowerCaseTagName = tag.name.toLowerCase();
//             const add = await insert_ingredients(lowerCaseTagName);
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
// })();



// async function getRecipe(user_recipes) {
//   try {
//     const recipes = [];

//     if (user_recipes.length === 0) {
//       return JSON.stringify(recipes); // return empty list 
//     }

//     // Use a single query with the IN clause to fetch recipes from both tables
//     const query = `
//       SELECT title, prep_time, cook_time, servings, ingredients, instructions, uid
//       FROM recipes
//       WHERE uid = ANY($1)
//       UNION
//       SELECT title, prep_time, cook_time, servings, ingredients, instructions, uid
//       FROM recipes2
//       WHERE uid = ANY($1);
//     `;

//     const result = await pool.query(query, [user_recipes]);

//     for (const recipe of result.rows) {
//       recipes.push(recipe);
//     }

//     const recipesJSON = JSON.stringify(recipes);
//     return recipesJSON;
//   } catch (error) {
//     console.error("Error fetching saved recipes from the database:", error);
//     throw error;
//   }
// }

// (async () => {
//   try {
//     const userRecipes = await getRecipe(['596141eb402e57340b6d5f6c55e768fa9987435911e4003d41941878783fd6ca', 'c2a0b62b50f50154a569ac36a84d22a5d21692011de29af4d57ee3816d6adfd5']);
//     console.log("user Recipes:", userRecipes);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// })();





module.exports = pool;