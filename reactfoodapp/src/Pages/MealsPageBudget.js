// MealsPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MealCard from './MealCard';

export default function MealsPageBudget ()  {
  const [meals, setMeals] = useState([]);
  const navigate = useNavigate();
  const jwtToken = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch('http://localhost:8081/meals/mealWithBudget', {
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
         // alert(mealsData.message); // sau gestionează mesajul într-un alt mod, de exemplu printr-un state pentru mesaje
        } else {
          // Dacă serverul a trimis mese, continuă ca înainte
          const filteredMeals = mealsData.length > 0 ? mealsData : [];
          setMeals(filteredMeals);
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
  const profileStyle = {
      
    marginBottomTargets: {
        marginBottom: '12em'
    },
};
 // ... other code remains the same

return (
  <div style={{ paddingTop: '40px',...profileStyle.marginBottomTargets }}> {/* Ajustează această valoare în funcție de înălțimea navbar-ului tău */}
    <h2>Meals that are in your budget interval:</h2>
    <div style={{ paddingTop: '20px' }}></div>
    <div className="meals-container">
      {meals.length > 0 ? (
        meals.map((meal, index) => (
          <MealCard key={index} meal={meal} onMealSelect={() => navigate(`/meal/${meal.id_meal}`)} />
        ))
      ) : (
        <p>No meals available within your budget! Please try again with a different budget.</p>
      )}
    </div>
  </div>
);

};


