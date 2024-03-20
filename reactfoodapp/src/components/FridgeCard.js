import  { useState, useEffect } from 'react';
import React from 'react';
import CustomImage from "./CustomImage";
import { useNavigate } from 'react-router-dom';
import { faPlus, faCheck, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import  {jwtDecode}  from 'jwt-decode';
//import jwt_decode from 'jsonwebtoken';


export default function FridgeCard({ product }) {
  
  const navigate = useNavigate();
  const [productUnits, setProductUnits] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const jwtToken = localStorage.getItem('jwtToken');
const decodedToken = jwtDecode(jwtToken); // Presupunând că utilizați o bibliotecă pentru decodificarea token-ului JWT, cum ar fi jwt-decode
//const userID_user = decodedToken.userID;
useEffect(() => {
  const fetchProductUnits = async () => {
      try {
          const response = await fetch(`http://localhost:8081/products/get-product-units/${product.id_product}`, {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${jwtToken}`,
                  'Content-Type': 'application/json'
              },
          });

          if (!response.ok) {
              throw new Error(`Network response was not ok: ${response.statusText}`);
          }

          const data = await response.json();
          setProductUnits(data.units);
      } catch (error) {
          console.error('Error fetching product units:', error);
      }
  };

  fetchProductUnits();
}, [product.id_product, jwtToken]);

const handleViewProductClick = () => {
  navigate(`/product/${product.id_product}`);
};
  const handleDecreaseUnit = async () => {
    // Logic to decrease units
    const jwtToken = localStorage.getItem('jwtToken');
    const decodedToken = jwtDecode(jwtToken);
    const userID_user = decodedToken.id_user;
    console.log("Product object:", product);

    // Definim numărul de unități care trebuie adăugate
    const unitsToAdd = -1; // Adăugăm doar o unitate
    console.log({
      userID_user: userID_user,
      productID_product: product.id_product,
      units: unitsToAdd
    });
    
    try {
        const response = await fetch('http://localhost:8081/products/remove-product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
            },
            body: JSON.stringify({
                userID_user: userID_user,
                productsID_product: product.id_product,
                units: unitsToAdd
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        if (response.ok) {
            const data = await response.json();
            if (data && data.units !== undefined) {
                setProductUnits(data.units);
                setIsAdded(true);
            } else {
                throw new Error('Invalid response data');
            }
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error adding product to user:', error);
    }
  };
  const handleAddUnit = async (req, res) => {
    const jwtToken = localStorage.getItem('jwtToken');
    const decodedToken = jwtDecode(jwtToken);
    const userID_user = decodedToken.id_user;
    console.log("Product object:", product);

    // Definim numărul de unități care trebuie adăugate
    const unitsToAdd = 1; // Adăugăm doar o unitate
    console.log({
      userID_user: userID_user,
      productID_product: product.id_product,
      units: unitsToAdd
    });
    
    try {
        const response = await fetch('http://localhost:8081/products/add-product', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID_user: userID_user,
                productsID_product: product.id_product,
                units: unitsToAdd
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        if (response.ok) {
            const data = await response.json();
            console.log("Decoded token:", decodedToken);
console.log("JWT token:", jwtToken);
console.log("Response data:", data);

            if (data && data.units !== undefined) {
                setProductUnits(data.units);
                setIsAdded(true);
            } else {
                throw new Error('Invalid response data');
            }
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error adding product to user:', error);
    }
};

return (
  <div className="fridge-card">
    <CustomImage imgSrc={product.image} pt="65%" />
    <div className="fridge-card-info">
      <p className="fridge-title">{product.title}</p>
      <p className="product-units">Units: {productUnits}</p> {/* Display the unit count */}
      <div className="fridge-card-actions">
        <button className="view-btn" onClick={handleViewProductClick}>VIEW PRODUCT</button>
        <button className="more-info-btn" onClick={handleAddUnit}>
          <FontAwesomeIcon icon={faPlus} />{/* Display checkmark if added */}
        </button>
        
          <button className="less-info-btn" onClick={handleDecreaseUnit}>
            <FontAwesomeIcon icon={faMinus} /> {/* Minus icon */}
          </button>
        
      </div>
    </div>
  </div>
);

}
