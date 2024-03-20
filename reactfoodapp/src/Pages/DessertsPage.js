import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DessertCard from '../components/DessertCard'; // Presupunem că ai creat deja acest component

export default function DessertsPage() {
  const [desserts, setDesserts] = useState([]);
  const navigate = useNavigate();
  const jwtToken = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchDesserts = async () => {
      try {
        const response = await fetch('http://localhost:8081/desserts/generateDessertFromProducts', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch desserts');
        }

        const dessertsData = await response.json();
        setDesserts(dessertsData);
      } catch (error) {
        console.error('Error fetching desserts:', error);
      }
    };

    fetchDesserts();
  }, [jwtToken]);

  const handleViewDessertClick = (dessertId) => {
    navigate(`/dessert/${dessertId}`);
  };

  return (
    <div style={{ paddingTop: '40px' }}> {/* Ajustează această valoare în funcție de înălțimea navbar-ului tău */}
        <h2>Desserts based on your fridge contents:</h2>
        <div style={{ paddingTop: '20px' }}></div>
        <div className="desserts-container">
            {desserts.length > 0 ? (
                desserts.map((dessert, index) => (
                    <DessertCard key={index} dessert={dessert} onDessertSelect={() => navigate(`/dessert/${dessert.id_dessert}`)} />
                ))
            ) : (
                <p>No desserts available with the current fridge contents.</p>
            )}
        </div>
    </div>
  );
}
