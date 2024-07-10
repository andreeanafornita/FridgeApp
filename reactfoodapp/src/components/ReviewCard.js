import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function ReviewCard({ type, id }) {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
  
    useEffect(() => {
      const fetchReviews = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`http://localhost:8081/review/review/${type}/${id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
            },
          });
  
          if (!response.ok) {
            throw new Error(`Failed to fetch ${type} reviews`);
          }
  
          const data = await response.json();
          setReviews(data);
        } catch (error) {
          console.error(`Error fetching ${type} reviews:`, error);
          setError(`There are no ${type} reviews. Please try again later`);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchReviews();
    }, [type, id]);
  
    // Stiluri
    const containerStyle = {
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#DFCED0',
      margin: '30px 0',
    };
  
    const headerStyle = {
      textAlign: 'center',
      color: '#333',
      margin: '0 0 20px 0',
    };
  
    const reviewContainerStyle = {
      marginBottom: '15px',
      borderBottom: '1px solid #eee',
      paddingBottom: '10px',
    };
  
    const usernameStyle = {
      fontWeight: 'bold',
      color: '#007bff',
    };
  
    const reviewTextStyle = {
      color: '#666',
    };
  
    if (isLoading) return <div>Loading reviews...</div>;
    if (error) return <div>Error: {error}</div>;
    if (reviews.length === 0) return <div>No reviews available for this {type}.</div>;
  
    return (
      <div style={containerStyle}>
        <h2 style={headerStyle}>{type.charAt(0).toUpperCase() + type.slice(1)} Reviews</h2>
        {reviews.map((review, index) => (
          <div key={index} style={reviewContainerStyle}>
            <p style={usernameStyle}>User: {review.User.username}</p>
            <p style={reviewTextStyle}>Review: {review.descriptionReview}</p>
          </div>
        ))}
      </div>
    );
  }
  
