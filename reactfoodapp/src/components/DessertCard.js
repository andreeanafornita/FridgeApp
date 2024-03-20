import React from 'react';

export default function DessertCard({ dessert, onDessertSelect }) {
    console.log('Dessert data:', dessert);
    const imageSrc = `${dessert.base64CodeImageDessert || ''}`;
    return (
        <div className="dessert-card" onClick={onDessertSelect}>
            <div className="image-container" style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
                <img src={imageSrc} alt={dessert.name_dessert || 'Dessert'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="dessert-card-info">
                <p className="dessert-title">{dessert.name_dessert || 'Unknown'}</p>
                <button className="view-dessert-btn">VIEW DESSERT</button>
            </div>
        </div>
    );
}
