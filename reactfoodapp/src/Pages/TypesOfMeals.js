import React from "react";
import { useNavigate } from "react-router-dom";

export default function TypesOfMeals() {
  const navigate = useNavigate();

  // Function to handle navigation on image click
  const handleImageClick = (path) => {
    navigate(path);
  };
  const profileStyle = {
      
    marginBottomTargets: {
        marginBottom: '-3em'
    },
};
  return (
    <div className="make-a-meal-container" style={{...profileStyle.marginBottomTargets}}>
      {/* First Image and Text */}
      <div className="image-text-container" onClick={() => handleImageClick('/mealsPage')}>
        <p className="meal-description">Make a meal based on what you have in your fridge</p>
        <img src="/images/Make a meal based on what you have on your fridge.png" alt="Image 1" className="meal-image" />
      </div>

      {/* Second Image and Text */}
      <div className="image-text-container" onClick={() => handleImageClick('/mealsPageBudget')}>
        <p className="meal-description">Make a meal based on a specific budget</p>
        <img src="/images/make a meal based.jpg" alt="Image 2" className="meal-image" />
      </div>
      <div className="image-text-container" onClick={() => handleImageClick('/recommendedMeals')}>
        <p className="meal-description">Our recommandation</p>
        <img src="/images/Our recommandation.jpg" alt="Image 2" className="meal-image" />
      </div>
    </div>
  );
}
