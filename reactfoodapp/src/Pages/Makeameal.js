import React from "react";
import { useNavigate } from "react-router-dom";

export default function Makeameal() {
  const navigate = useNavigate();

  // Function to handle navigation on image click
  const handleImageClick = (path) => {
    navigate(path);
  };

  return (
    <div className="make-a-meal-container">
     
      <div className="image-text-container" onClick={() => handleImageClick('/typesofmeals')}>
        <p className="meal-description">Make a meal</p>
        <img src="/images/1004_Paste cu sos pesto si rosii uscate la soare.jpg" alt="Image 1" className="meal-image" />
      </div>

      
      <div className="image-text-container" onClick={() => handleImageClick('/typeofdesserts')}>
        <p className="meal-description">Make a dessert</p>
        <img src="/images/1041_Terci de ovaz cu banane.jpg" alt="Image 2" className="meal-image" />
      </div>
    </div>
  );
}
