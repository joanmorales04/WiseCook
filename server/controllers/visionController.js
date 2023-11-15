// const { OpenAI } = require('openai');
// const fetch = require('node-fetch');
// const fs = require('fs');
// const { promisify } = require('util');
// const sharp = require('sharp');

// // Create an instance of the OpenAIApi
// const openai = new OpenAI({
//   apiKey: process.env["OPENAI_API_KEY"]
// });

// // Function to resize and encode the image
// async function resizeAndEncodeImage(imagePath, width, height) {
//   const readFileAsync = promisify(fs.readFile);
//   const imageBuffer = await readFileAsync(imagePath);

//   // Resize the image to the specified dimensions (ex: 150x150)
//   const resizedImageBuffer = await sharp(imageBuffer)
//     .resize(width, height)
//     .toBuffer();

//   const base64Image = resizedImageBuffer.toString('base64');
//   return base64Image;
// }

// // Function to generate API response
// async function generateTextWithImage(prompt, imagePath, imageWidth, imageHeight) {
//   try {
//     const base64Image = await resizeAndEncodeImage(imagePath, imageWidth, imageHeight);

//     const headers = {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${process.env["OPENAI_API_KEY"]}`,
//     };

//     const payload = {
//       "model": "gpt-4-vision-preview",
//       "messages": [
//         {
//           "role": "user",
//           "content": [
//             {
//               "type": "text",
//               "text": prompt,
//             },
//             {
//               "type": "image_url",
//               "image_url": {
//                 "url": `data:image/jpeg;base64,${base64Image}`,
//               },
//             },
//           ],
//         },
//       ],
//       "max_tokens": 300,
//     };

//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: 'POST',
//       headers: headers,
//       body: JSON.stringify(payload),
//     });

//     const responseData = await response.json();
//     return responseData;
//   } catch (error) {
//     throw error;
//   }
// }

// // handle all functions for recipeRoutes here
// const visionController = {

//   // Function to generate a recipe based on the prompt and resized image
//   generateRecipeFromImage: async (imagePath, imageWidth=150, imageHeight=150) => {
//     try {
//       const prompt = `Is this image food? If yes, generate me a recipe so that I could make it. The recipe should include the necessary ingredients, and the instructions should contain easy-to-understand vocabulary.
//       Limit the response to no more than 500 words and in JSON format with the properties and their respective values: title, prep_time, cook_time, servings, ingredients, instructions. Ingredients and Instructions should hold the values in an array.`;

//       // Generate the recipe text using the provided prompt and resized image
//       const generatedRecipe = await generateTextWithImage(prompt, imagePath, imageWidth, imageHeight);

//       // Return the generated recipe
//       return generatedRecipe;
//     } catch (error) {
//       throw error;
//     }
//   },


// };



// module.exports = visionController;