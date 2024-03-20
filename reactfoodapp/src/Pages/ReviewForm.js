import React, { useState, useEffect } from 'react';

export default function ReviewForm() {
  const [reviewText, setReviewText] = useState('');
  const [selectedMeal, setSelectedMeal] = useState('');
  const [selectedDessert, setSelectedDessert] = useState('');
  const [meals, setMeals] = useState([]);
  const [desserts, setDesserts] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchCurrentUser = async () => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            try {
                const response = await fetch('http://localhost:8081/users/current', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    // Setează userID în localStorage sau în starea componentei
                    localStorage.setItem('userID', data.userID); // sau folosește o stare dacă preferi
                } else {
                    console.error('Failed to fetch user details');
                }
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        }
    };

    fetchCurrentUser();
}, []); // Dependința goală asigură că efectul se execută o singură dată

  useEffect(() => {
    // Funcție pentru a prelua meals din backend
    const fetchMeals = async () => {
      const token = localStorage.getItem('jwtToken'); // Preia tokenul JWT stocat
      const response = await fetch('http://localhost:8081/review/meals/names', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Include tokenul JWT în header
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setMeals(data);
    };

    // Funcție pentru a prelua desserts din backend
    const fetchDesserts = async () => {
      const token = localStorage.getItem('jwtToken'); // Preia tokenul JWT stocat
      const response = await fetch('http://localhost:8081/review/desserts/names', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Include tokenul JWT în header
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setDesserts(data);
    };

    fetchMeals();
    fetchDesserts();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Obține userID din stocare locală sau contextul aplicației
    const userID = localStorage.getItem('userID'); // Asigură-te că acesta este corect setat
    console.log('UserID at handleSubmit:', userID);
    
    // Verifică dacă userID este null sau undefined și gestionează cazul corespunzător
    if (!userID) {
      console.error('User ID is missing');
      return; // Oprește executarea funcției dacă nu există un userID valid
    }
  
    const reviewData = {
      descriptionReview: reviewText,
      userID_review: userID, 
      dessertID_review: selectedDessert || null, // Asigură-te că este null dacă nu este selectat
      mealID_review: selectedMeal || null, // La fel și pentru meal
    };
    
    
    
    const token = localStorage.getItem('jwtToken'); // Preia tokenul JWT stocat
    
    try {
      const response = await fetch('http://localhost:8081/review/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('Review added successfully:', responseData);
        setSuccessMessage('Review added successfully! Thank you for your feedback!');
setTimeout(() => {
  setSuccessMessage('');
}, 5000); // Mesajul va dispărea după 5 secunde

        // Logica pentru succes
      } else {
        console.error('Failed to add review');
        // Gestionează erorile de răspuns
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      // Gestionează excepțiile
    }
  
    // Resetează formularul
    setReviewText('');
    setSelectedMeal('');
    setSelectedDessert('');
  };
  


  // Stiluri
  const formContainerStyle = {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '600px',
    margin: 'auto',
    marginTop: '50px',
    borderRadius: '15px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#ffffff',
  };

  const buttonStyle = {
    padding: '10px 30px',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '20px',
    boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.2)',
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#5cb85c',
    color: 'white',
    marginTop: '20px',
  };
  const selectStyle = {
    width: '100%',
    marginBottom: '20px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '17px', // Mărește dimensiunea fontului
    backgroundColor: '#fff', // Opțional, pentru a seta un fundal specific
    color: '#333', // Schimbă culoarea textului dacă este necesar
  };

  return (
    <div style={formContainerStyle}>
      <h2>Leave a Review</h2>
      {successMessage && <div style={{ color: 'green', margin: '10px 0' }}>{successMessage}</div>}
      <form onSubmit={handleSubmit} style={{width: '100%'}}>
        <textarea
          id="reviewText" // Adaugă un ID unic
          name="reviewText" // Adaugă un nume unic
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Type your review here..."
          rows="4"
          style={{width: '100%', marginBottom: '20px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize:'17px'}}
          autoComplete="off" // Opțional: Dezactivează autofill-ul pentru acest câmp
        />
        <select
          id="selectedMeal" // Adaugă un ID unic
          name="selectedMeal" // Adaugă un nume unic
          value={selectedMeal}
          onChange={(e) => setSelectedMeal(e.target.value)}
          style={selectStyle}
          autoComplete="off" // Opțional: Poți activa autofill-ul cu valori relevante
        >
          <option value="">Select a Meal</option>
          {meals.map(meal => <option key={meal.id_meal} value={meal.id_meal}>{meal.name_meal}</option>)}
        </select>
        <select
          id="selectedDessert" // Adaugă un ID unic
          name="selectedDessert" // Adaugă un nume unic
          value={selectedDessert}
          onChange={(e) => setSelectedDessert(e.target.value)}
          style={selectStyle}
          autoComplete="off" // Similar cu mai sus, ajustează după caz
        >
          <option value="">Select a Dessert</option>
          {desserts.map(dessert => <option key={dessert.id_dessert} value={dessert.id_dessert}>{dessert.name_dessert}</option>)}
        </select>
        <button type="submit" style={buttonStyle}>Save</button>
      </form>
    </div>
  );
  
}
