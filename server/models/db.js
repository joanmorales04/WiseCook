const Pool = require('pg').Pool;

const pool = new Pool({
	user: "postgres",
	password: "wc$1001",
	host: "35.232.17.107",
	port: 5432,
	database: "wisecook"
})
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

// module.exports = pool;