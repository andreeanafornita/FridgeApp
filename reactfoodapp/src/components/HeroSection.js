import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
    const images = [
        "/images/img1.jpg",
        "/images/img2.webp",
        "/images/img3.jpg",
        "/images/img4.jpg",
        "/images/img5.jpg",
        "/images/img6.jpg",
        "/images/img7.jpg",
        "/images/img9.avif"
    ];

    const navigate = useNavigate();
    const handleExploreClick = () => {
        navigate('/myfridge'); // Redirecționează către /myfridge
    };

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Schimbă imaginea la fiecare 3 secunde
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="section hero" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 0', margin: '20px 0' }}>
            <div className="col typography" style={{ flex: 1, textAlign: 'left', padding: '20px' }}>
                <h1 className="title">What are we about</h1>
                <p className="info">
                    FridgeFest is not a common fest!
                    Here you can please your soul and tummy with delicious meals generated specially for your needs.  
                </p>
                <button className="btn" onClick={handleExploreClick}>
                    Find your products now
                </button>
            </div>
            <div className="col gallery" style={{ flex: 1, maxWidth: '600px', display: 'flex', justifyContent: 'center' }}>
                <img src={images[currentIndex]} style={{ width: '100%', height: 'auto', maxWidth: '600px' }} alt="Gallery" />
            </div>
        </div>
    );
}
