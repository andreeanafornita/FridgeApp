import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function ProductView() {
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState({});
  const [expirationDate, setExpirationDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expirationDates, setExpirationDates] = useState([]);

  // Definim `fetchExpirationDates` aici pentru a o putea apela atât în useEffect, cât și în handleSetExpirationDate
  const fetchExpirationDates = async () => {
    console.log(`Fetching expiration dates for product ID: ${id}`);
    try {
      const response = await fetch(`http://localhost:8081/products/getExpirationDates/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch expiration dates');
      }

      const dates = await response.json();
      setExpirationDates(dates);
    } catch (error) {
      console.error('Failed to fetch expiration dates:', error);
      // Opțional: Gestionați eroarea aici
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      console.log(`Fetching product details for product ID: ${id}`);
      try {
        const response = await fetch(`http://localhost:8081/products/product/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Product details fetch failed');
        }

        const productData = await response.json();
         console.log("Dates from server:", productData);
        setProductDetails(productData);
       
        setExpirationDate(productData.exp_dateUser || '');
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch product details:', error);
        setError('Failed to fetch product details');
        setIsLoading(false);
      }
    };

    fetchProductDetails();
    fetchExpirationDates(); // Apelăm aici pentru a încărca datele la început
  }, [id]); // Dependința [id] asigură reîmprospătarea atunci când ID-ul produsului se schimbă

  const handleSetExpirationDate = async () => {
    console.log(`Setting expiration date for product ID: ${id} to ${expirationDate}`);
    try {
      const response = await fetch('http://localhost:8081/products/setExpirationDate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: id,
          expirationDate: expirationDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to set expiration date');
      }

      // După setare, reîmprospătați datele de expirare apelând fetchExpirationDates
      await fetchExpirationDates(); // Reîmprospătați datele de expirare după setarea cu succes
          // Dacă avem mai mult de 10 date de expirare, ștergem cele mai vechi
    if (expirationDates.length >= 10) {
      const newDates = [...expirationDates];
      newDates.shift(); // Ștergem prima dată (cea mai veche)
      setExpirationDates(newDates);
    }
    } catch (error) {
      console.error('Error setting expiration date:', error);
      setError('Error setting expiration date');
    }
  };
  useEffect(() => {
    // Definirea funcției async în interiorul lui useEffect
    const fetchAndSetExpirationDates = async () => {
      const response = await fetch(`http://localhost:8081/products/getExpirationDates/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });
  
      if (response.ok) {
        const dates = await response.json();
        console.log(dates)
        setExpirationDates(dates); // Asumând că "dates" este un array de date de expirare
      } else {
        console.error('Failed to fetch expiration dates');
      }
    };
  
    fetchAndSetExpirationDates();
  }, [id]); 
  const checkIfExpired = (date) => {
    if (!date) return false; 
    const today = new Date();
    const expirationDate = new Date(date);
    return expirationDate < today;
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const quantityDisplay = productDetails.isLiquid ? 
  `${productDetails.base_quantity_product} ml` : 
  `${productDetails.base_quantity_product} g`;
  console.log({ expirationDates, isLoading });

  return (
    <div style={styles.container}>
      <h2>Product Details</h2>
      <div style={styles.productDetails}>
        <p style={styles.detail}>Name: {productDetails.name_product}</p>
        <p style={styles.detail}>Base Quantity: {quantityDisplay}</p>
        <p style={styles.detail}>Base Calories: {productDetails.base_calories_product} kcal</p>
        <p style={styles.detail}>Base Carbohydrates: {productDetails.base_glucides_product} g</p>
        <p style={styles.detail}>Base Lipides: {productDetails.base_lipides_product} g</p>
        <p style={styles.detail}>Base Proteins: {productDetails.base_proteins_product} g</p>
      </div>
      <div style={styles.expirationSection}>
        <label style={styles.label} htmlFor="expiration-date">Set Expiration Date:</label>
        <input
          style={styles.input}
          type="date"
          id="expiration-date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
        />
        <button style={styles.button} onClick={handleSetExpirationDate}>Save Expiration Date</button>
      </div>
      <div style={styles.expirationDatesSection}>
        <h3>Data saved:</h3>
        {expirationDates.length > 0 ? (
          expirationDates.map((date, index) => (
            <p key={index} style={{ color: checkIfExpired(date) ? 'red' : 'black' }}>
              {date} {checkIfExpired(date) && <span style={{ fontWeight: 'bold' }}>PRODUCT EXPIRED!</span>}
            </p>
          ))
        ) : (
          !isLoading && <p>N/A</p> // Se afișează N/A dacă nu există date de expirare salvate și s-a terminat încărcarea datelor
        )}
      </div>
      {productDetails.base64CodIamgeProduct && (
        <img style={styles.image} src={`${productDetails.base64CodIamgeProduct}`} alt="Product" />
      )}
    </div>
  );
  
  
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '20px',
    backgroundColor: '#f9f9f9',
  },
  productDetails: {
    marginTop: '10px',
    marginBottom: '5px',
  },
  detail: {
    marginBottom: '10px',
  },
  expirationSection: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  label: {
    marginRight: '10px',
  },
  input: {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginRight: '10px',
  },
  button: {
    padding: '8px 20px',
    backgroundColor: '#008000',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
  },
};
