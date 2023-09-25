const { OpenAI } = require('openai');

// Create an instance of the OpenAIApi
const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"]
});

// Define a function to generate text
const generateText = async (prompt) => {
  const response = await openai.createCompletion({
    model: 'gpt-3.5-turbo',
    prompt: prompt,
    temperature: 0,
    max_tokens: 800, // Specify the maximum number of tokens to generate
  });

  // Return the generated text from the response
  return response.choices[0].text;
}

// handle all functions for recipeRoutes here
const recipeController = {

  // Function to generate a recipe based on the prompt
  generateRecipe: async (prompt) => {
    try {
      // Generate the recipe text using the provided prompt
      const generatedRecipe = await generateText(prompt);

      // Return the generated recipe
      return generatedRecipe;
    } catch (error) {
      throw error;
    }
  },

};

module.exports = recipeController;