const { OpenAI } = require('openai');

// Create an instance of the OpenAIApi
const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"]
});

// function to generate api response
const generateText = async (prompt) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo',
  });

  return chatCompletion.choices[0].message.content;
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

  // Function to create a prompt and return based on the user input
  generatePrompt: async (prepTime, userIngredients) => {
    try {
      const prompt = `Generate a cooking recipe that can be prepared in ${prepTime} minutes using the following ingredient list: ${userIngredients.join(', ')}. 
      The recipe should include the necessary ingredients, and the instructions should contain easy-to-understand vocabulary.
      Limit the response to no more than 500 words and in JSON format with the properties and their respective values: title, prep_time, cook_time, servings, ingredients, instructions. Ingredients and Instructions should hold the values in an array. `;

      return prompt;
    } catch (error) { 
      throw error;
    }
  },

  // Function to create a prompt and return based on the user input
  regeneratePrompt: async (prepTime, userIngredients) => {
    try {
      const prompt = `Generate another cooking recipe that can be prepared in ${prepTime} minutes using the following ingredient list: ${userIngredients.join(', ')}. 
      The recipe should include the necessary ingredients, and the instructions should contain easy-to-understand vocabulary.
      Limit the response to no more than 500 words and in JSON format with the properties and their respective values: title, prep_time, cook_time, servings, ingredients, instructions. Ingredients and Instructions should hold the values in an array. `;

      return prompt;
    } catch (error) { 
      throw error;
    }
  },

};

module.exports = recipeController;