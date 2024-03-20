import CustomImage from "./CustomImage"
import React from 'react';
import { useNavigate } from 'react-router-dom';
export default function HeroSection(){
const images = [
    "/images/img1.jpg",
    "/images/img2.webp",
    "/images/img3.jpg",
    "/images/img4.jpg",
    "/images/img5.jpg",
    "/images/img6.jpg",
    "/images/img7.jpg",
    "/images/img8.webp",
    "/images/img9.avif"

];
const navigate = useNavigate();
const handleExploreClick = () => {
    navigate('/myfridge'); // Redirecționează către /myfridge
};
    return(
        <div className="section hero">
            <div className="col typography">
                <h1 className="title">What are we about</h1>
                <p className="info">
                FridgeFest is not a common fest!
                Here you can please your soul and tummy with delicious meals generated specially for your needs.  
                </p>
                <button className="btn" onClick={handleExploreClick}>
                Find your products now
                </button>
            </div>
            <div className="col gallery">
                {images.map((src,index)=>(
                     <CustomImage key={index} imgSrc={src} pt={"90%"}/>
                ))}
              
              
            </div>
        </div>
    )
}