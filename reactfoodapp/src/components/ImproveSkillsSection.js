import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ImproveSkills(){
    const list=[
        "Generate tasty meals and desserts with what you have in your fridge",
        "Make a meal or desserts based on a specific budget",
        "Write your own review for every meal or dessert ",
        "Get cooking tips",
        "Challenge yourself by doing targets",
        "Have your own theme mode"

    ];
    const navigate = useNavigate();
    const handleExploreClick = () => {
        navigate('/targets'); // Redirecționează către /myfridge
    };
    return(
        <div className="section improve-skills">
              <div className="col img">
            
              <img src="/images/img11.jpg" alt=""/>
              
            </div>
            <div className="col typography">
                <h1 className="title">Improve your culinary skills and stop wasting food from now!</h1>
                {list.map((item,index)=>(
                    <p className="skill-item" key={index}>{item}</p>
               ) )}
                <button className="btn" onClick={handleExploreClick}>
               Explore now
                </button>
            </div>
          
        </div>
    );
}