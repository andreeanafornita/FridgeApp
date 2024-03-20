import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DessertCard from '../components/DessertCard'; // Actualizarea importului pentru componenta de card pentru deserturi

export default function RecommendedDesserts() { // Actualizarea numelui componentei
  const [desserts, setDesserts] = useState([]); // Actualizarea numelui stării și a funcției setter
  const navigate = useNavigate();
  const jwtToken = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchDesserts = async () => {
      try {
        const response = await fetch('http://localhost:8081/desserts/recommendedDesserts', { // Actualizarea URL-ului pentru rută
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch desserts');
        }

        const dessertsData = await response.json();

        if (dessertsData.message) {
          // Dacă serverul a trimis un mesaj, setează deserturile ca fiind un array gol și afișează mesajul
          setDesserts([]);
          // Poti folosi un state pentru a afișa mesajul printr-un mecanism UI mai prietenos decât alert()
        } else {
          // Dacă serverul a trimis deserturi, continuă ca înainte
          setDesserts(dessertsData);
        }
      } catch (error) {
        console.error('Error fetching desserts:', error);
      }
    };

    fetchDesserts();
  }, [jwtToken]);

  const handleViewDessertClick = (dessertId) => { // Actualizarea numelei funcției și a parametrilor
    navigate(`/dessert/${dessertId}`); // Actualizarea rutei pentru a naviga către paginile corespunzătoare pentru deserturi
  };

  return (
    <div style={{ paddingTop: '40px' }}>
      <h2>Our Recommended Desserts:</h2> 
      <div style={{ paddingTop: '20px' }}></div>
      <div className="desserts-container"> 
        {desserts.length > 0 ? (
          desserts.map((dessert, index) => ( // Actualizarea numelui variabilei și a parametrilor
            <DessertCard key={index} dessert={dessert} onDessertSelect={() => handleViewDessertClick(dessert.id_dessert)} /> // Actualizarea numelui componentei și a parametrilor
          ))
        ) : (
          <p>No recommended desserts available. Please try again later.</p> // Actualizarea mesajului pentru lipsa deserturilor
        )}
      </div>
    </div>
  );
};
