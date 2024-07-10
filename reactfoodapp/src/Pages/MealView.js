import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';
export default function MealView() {
  const { id } = useParams(); // Presupunem că folosești React Router și ID-ul este parte din URL
  const [mealDetails, setMealDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMealDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8081/meals/details/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch meal details');
        }

        const data = await response.json();
        setMealDetails(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching meal details:', error);
        setError('Failed to fetch meal details');
        setIsLoading(false);
      }
    };

    fetchMealDetails();
  }, [id]);

  if (isLoading) return <div style={{ padding: '20px', fontSize: '18px' }}>Loading meal details...</div>;
  if (error) return <div style={{ padding: '20px', fontSize: '18px', color: 'red' }}>Error: {error}</div>;
  if (!mealDetails || Object.keys(mealDetails).length === 0) {
    return <div style={{ padding: '20px', fontSize: '18px' }}>No meal details available.</div>;
  }

  return (
    <div>
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px',marginTop:'15px', background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', borderRadius: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ fontSize: '32px', marginBottom: '20px', color: '#fff', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>Meal Details</h2>
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>{mealDetails.name_meal}</p>
        <p style={{ fontSize: '18px', marginBottom: '8px', color: '#666' }}>Calories: {mealDetails.calories_meal}kcal</p>
        <p style={{ fontSize: '18px', marginBottom: '8px', color: '#666' }}>Carbohydrates: {mealDetails.glucides_meal}g</p>
        <p style={{ fontSize: '18px', marginBottom: '8px', color: '#666' }}>Lipides: {mealDetails.lipides_meal}g</p>
        <p style={{ fontSize: '18px', marginBottom: '8px', color: '#666' }}>Proteins: {mealDetails.proteins_meal}g</p>
        <p style={{ fontSize: '18px', marginBottom: '8px', color: '#666' }}>Aprox. price: {mealDetails.price_meal} RON</p>
        <p style={{ fontSize: '18px', marginBottom: '8px', color: '#666' }}>Quantity: {mealDetails.quantity_meal} Kg</p>
        <p style={{ fontSize: '18px', marginBottom: '8px', color: '#666', wordWrap: 'break-word' }}>Preparation Mode: {mealDetails.prep_mode_meal || 'N/A'}</p>
        {mealDetails.base64CodImageMeal && (
          <img src={`${mealDetails.base64CodImageMeal}`} alt="Meal" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginTop: '20px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} />
        )}
      </div>
    </div>
    <ReviewCard type="meal" id={id} />
    </div>
    
    
    
  );
}
