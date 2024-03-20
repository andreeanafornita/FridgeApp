import React from 'react';

export default function MealCardBudget({ meal, onMealSelect }) {
    const imageSrc = `${meal.base64CodImageMeal || ''}`;
    return (
        <div className="meal-card" onClick={onMealSelect}>
            <div className="image-container" style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
                <img src={imageSrc} alt={meal.name_meal|| 'Meal'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="meal-card-info">
            <p className="meal-title">{meal.name_meal || 'Unknown'}</p>            
                <button className="view-meal-btn">VIEW MEAL</button>
            </div>
        </div>
    );
}