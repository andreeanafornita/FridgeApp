import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MealCard from './MealCard';
export default function MealsPage() {
  const [meals, setMeals] = useState([]);
  const navigate = useNavigate();
  const jwtToken = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch('http://localhost:8081/meals/generateMealFromProducts', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch meals');
        }

        const mealsData = await response.json();
        setMeals(mealsData);
      } catch (error) {
        console.error('Error fetching meals:', error);
      }
    };

    fetchMeals();
  }, [jwtToken]);

  const handleViewMealClick = (mealId) => {
    navigate(`/meal/${mealId}`);
  };

  return (
    <div style={{ paddingTop: '40px' }}> {/* Ajustează această valoare în funcție de înălțimea navbar-ului tău */}
        <h2>Meals based on your fridge contents:</h2>
        <div style={{ paddingTop: '20px' }}></div>
        <div className="meals-container">
            {meals.length > 0 ? (
                meals.map((meal, index) => (
                    <MealCard key={index} meal={meal} onMealSelect={() => navigate(`/meal/${meal.id_meal}`)} />
                ))
            ) : (
              
                <p>No meals available with the current fridge contents.</p>
            )}
        </div>
    </div>
  );
}
