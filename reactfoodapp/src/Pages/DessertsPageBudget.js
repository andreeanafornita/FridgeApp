import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DessertCard from "../components/DessertCard";
export default function DessertsPageBudget ()  {
    const [desserts, setDesserts] = useState([]);
    const navigate = useNavigate();
    const jwtToken = localStorage.getItem('jwtToken');
  
    useEffect(() => {
      const fetchDesserts = async () => {
        try {
          const response = await fetch('http://localhost:8081/desserts/dessertWithBudget', {
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
            // alert(dessertsData.message); // sau gestionează mesajul într-un alt mod, de exemplu printr-un state pentru mesaje
          } else {
            // Dacă serverul a trimis deserturi, actualizează state-ul corespunzător
            const filteredDesserts = dessertsData.length > 0 ? dessertsData : [];
            setDesserts(filteredDesserts);
          }
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
      <div style={{ paddingTop: '40px' }}>
        <h2>Our recommendation desserts:</h2>
        <div style={{ paddingTop: '20px' }}></div>
        <div className="desserts-container">
          {desserts.length > 0 ? (
            desserts.map((dessert, index) => (
              <DessertCard key={index} dessert={dessert} onDessertSelect={() => navigate(`/dessert/${dessert.id_dessert}`)} />
            ))
          ) : (
            <p>No desserts available with the current budget! Please try again with another budget.</p>
          )}
        </div>
      </div>
    );
  };