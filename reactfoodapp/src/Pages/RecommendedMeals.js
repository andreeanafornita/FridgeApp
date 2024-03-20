import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MealCard from './MealCard';

export default function RecommendedMeals() {
  const [meals, setMeals] = useState([]);
  const navigate = useNavigate();
  const jwtToken = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch('http://localhost:8081/meals/recommendedMeals', { // Actualizează URL-ul aici
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch meals');
        }

        const mealsData = await response.json();

        if (mealsData.message) {
          // Dacă serverul a trimis un mesaj, setează mesele ca fiind un array gol și afișează mesajul
          setMeals([]);
          // Poti folosi un state pentru a afișa mesajul printr-un mecanism UI mai prietenos decât alert()
        } else {
          // Dacă serverul a trimis mese, continuă ca înainte
          setMeals(mealsData);
        }
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
    <div style={{ paddingTop: '40px' }}>
      <h2>Our Recommended Meals:</h2>
      <div style={{ paddingTop: '20px' }}></div>
      <div className="meals-container">
        {meals.length > 0 ? (
          meals.map((meal, index) => (
            <MealCard key={index} meal={meal} onMealSelect={() => handleViewMealClick(meal.id_meal)} />
          ))
        ) : (
          <p>No recommended meals available. Please try again later.</p>
        )}
      </div>
    </div>
  );
};
