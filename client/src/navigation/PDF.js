import React, {useRef, useState} from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import '../App.css'; // Import App.css from the parent directory
import pdfHeader from '../images/pdfHeader.png';

  const PDF = ({ recipes, user, setUser }) => {

    const [expandedRecipe, setExpandedRecipe] = useState(null);
    const [isRecipeSaved, setIsRecipeSaved] = useState(false);
    const [isRecipeDeleted, setIsRecipeDeleted] = useState(false);
 
    const toggleRecipeExpansion = (index) => {
      setExpandedRecipe((prevIndex) => (prevIndex === index ? null : index));
    };  

    const pdfRef = useRef();

    const downloadPDF = (recipeTitle) => {
      const recipeTitleFormatted = recipeTitle.replace(/\s+/g, '-');
      const input = pdfRef.current;
      html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  
      const headerImgWidth = 35; 
      const headerImgHeight = 8; 
      const imgX = 8;
      const imgY = 10; 

      // Position for the content image
      const contentImgX = -8; 
      const contentImgY = 40;
  
      // Add header image
      pdf.addImage(pdfHeader, 'PNG', imgX, imgY, headerImgWidth, headerImgHeight);

      // Add content image
      pdf.addImage(imgData, 'PNG', contentImgX, contentImgY, imgWidth * ratio, imgHeight * ratio);

      pdf.save(`${recipeTitleFormatted}.pdf`);
      });
    };
    
    const handleDeleteRecipe = async (recipeId) => {
      try {
        const response = await fetch('http://localhost:8080/unsaverecipe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',    
          },
          body: JSON.stringify({ user_key: user, recipeID: recipeId }),
        });
    
        if (response.ok) {
    
          const deleteRecipeResponse = await response.json();
          const updatedUserRecipeDeleted = deleteRecipeResponse.user;
    
          if(updatedUserRecipeDeleted != null)
          {
            setUser(updatedUserRecipeDeleted);
          }
    
          // console.log('Recipe deleted successfully');
          setIsRecipeSaved(false);
          setIsRecipeDeleted(true); 
        } else {
          throw new Error('Failed to delete the recipe');
        }
      } catch (error) {
        console.error('An error occurred while deleting the recipe:', error);
      }
    };
    
    return (
      <div className="savedrecipes-container" > 
      {recipes.map((recipe, index) => (
        <div
        key={index}
        className={`recipe-card ${expandedRecipe === index ? 'expanded' : ''}`}
        onClick={() => toggleRecipeExpansion(index)}
        >
          <p>{recipe.title}</p>
          {expandedRecipe === index && (
            

          <div className="saved-generated-recipe-container" > 
            <div ref={pdfRef}>

              <h3>{recipe.title}</h3>

              <div className="saved-recipe-container" >
             

                <div className="generated-container-left">
                  <p><b>Preparation Time:</b> {recipe.prep_time}</p>
                  <p><b>Cook Time:</b> {recipe.cook_time}</p>
                  <p><b>Makes</b> {recipe.servings} servings</p>
                  <br />

                  <div className="recipe-section"> 
                    <p><b>Ingredients:</b></p> 
                    {recipe.ingredients.map((ingredient, idx) => (
                      <p key={idx}>{ingredient}</p>
                    ))}
                  </div>
                </div>


                <div className="generated-container-right">
                  <div className="recipe-section"> 
                    <p id="directions-title">Directions:</p>
                    {recipe.instructions.map((instruction, idx) => (
                      <p key={idx}>{instruction}</p>
                    ))}
                  </div>
                </div>
             </div>
            </div>

            <div className="button-container-a">
              <button className="unsave-saved-recipe-button" onClick={() => handleDeleteRecipe(recipe.uid)}> Unsave Recipe</button>
              <button className="download-button" onClick={() => downloadPDF(recipe.title)}> Download PDF </button>

              
            </div>
          </div>

          )}
        </div>
      ))}

        
    </div>

      

    );
  };

export default PDF;