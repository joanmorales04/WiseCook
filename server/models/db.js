const Pool = require('pg').Pool;

const pool = new Pool({
	user: "wisecook",
	password: "wc$100",
	host: "localhost",
	port: 5432,
	database: "recipesdb"
})

// async function getAllRecipes() {
//   const query = 'SELECT * FROM recipes';
//   const result = await pool.query(query);

//   console.log("Database:", result.rows);
//   return result.rows;
// }

// (async () => {
//   const allRecipes = await getAllRecipes();
// })();


module.exports = pool;