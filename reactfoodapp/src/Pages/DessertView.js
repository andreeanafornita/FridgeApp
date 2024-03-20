import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';
export default function DessertView() {
  const { id } = useParams();
  const [dessertDetails, setDessertDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDessertDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8081/desserts/details/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dessert details');
        }

        const data = await response.json();
        setDessertDetails(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dessert details:', error);
        setError('Failed to fetch dessert details');
        setIsLoading(false);
      }
    };

    fetchDessertDetails();
  }, [id]);

 // Continuarea codului tău ...
if (isLoading) return <div className="dessert-details-container">Loading dessert details...</div>;
if (error) return <div className="dessert-details-container">Error: {error}</div>;
if (!dessertDetails || Object.keys(dessertDetails).length === 0) {
  return <div className="dessert-details-container">No dessert details available.</div>;
}
return (
  <div>
  <div className="dessert-details-container">
    <h2 className="dessert-details-header">Dessert Details</h2>
    <div>
      <p className="dessert-detail"><strong>Name:</strong> {dessertDetails.name_dessert}</p>
      <p className="dessert-detail"><strong>Calories:</strong> {dessertDetails.calories_dessert}g</p>
      <p className="dessert-detail"><strong>Glucides:</strong> {dessertDetails.glucides_dessert}g</p>
      <p className="dessert-detail"><strong>Lipides:</strong> {dessertDetails.lipides_dessert}g</p>
      <p className="dessert-detail"><strong>Proteins:</strong> {dessertDetails.proteins_dessert}g</p>
      <p className="dessert-detail"><strong>Aprox. price:</strong> {dessertDetails.price_dessert} RON</p>
      <p className="dessert-detail"><strong>Quantity:</strong> {dessertDetails.quantity_dessert}kg</p>
      <p className="dessert-detail"><strong>Preparation Mode:</strong> {dessertDetails.prep_mode_dessert || 'N/A'}</p>
      {dessertDetails.base64CodeImageDessert && (
        <div className="dessert-image-container">
          <img src={`${dessertDetails.base64CodeImageDessert}`} alt="Dessert" className="dessert-image" />
        </div>
      )}
    </div>
  </div>
  <ReviewCard type="dessert" id={id} />
  </div>
);

}
