import React from "react";
import { useNavigate } from "react-router-dom";

export default function TypeOfDesserts() {
  const navigate = useNavigate();

  // Function to handle navigation on image click
  const handleImageClick = (path) => {
    navigate(path);
  };

  return (
    <div className="make-a-meal-container">
      {/* First Image and Text */}
      <div className="image-text-container" onClick={() => handleImageClick('/dessertPage')}>
        <p className="meal-description">Make a dessert based on what you have in your fridge</p>
        <img src="/images/desert1.jpg" alt="Image 1" className="meal-image" />
      </div>

    
      <div className="image-text-container" onClick={() => handleImageClick('/dessertPageBudget')}>
        <p className="meal-description">Make a dessert based on a specific budget</p>
        <img src="/images/desert2.jpg" alt="Image 2" className="meal-image" />
      </div>
      <div className="image-text-container" onClick={() => handleImageClick('/recommendedDesserts')}>
        <p className="meal-description">Our recommandation</p>
        <img src="/images/Our recommandation.jpg" alt="Image 2" className="meal-image" />
      </div>
    </div>
  );
}
