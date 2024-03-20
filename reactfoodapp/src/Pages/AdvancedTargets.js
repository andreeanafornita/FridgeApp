import React, { useEffect, useState } from 'react';

const AdvancedTargets = () => {
    const [advancedTargets, setAdvancedTargets] = useState([]);

    const fetchAdvancedTargets = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch('http://localhost:8081/alltargets/hardTargets', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setAdvancedTargets(data);
        } catch (error) {
            console.error("There was a problem with fetching advanced targets:", error);
        }
    };
    
     // Functie pentru a desparti descrierea in titlu si continut
     const splitDescription = (description) => {
        const splitIndex = description.indexOf('\n');
        return {
            title: splitIndex !== -1 ? description.slice(0, splitIndex) : description,
            content: splitIndex !== -1 ? description.slice(splitIndex + 1) : ''
        };
    };

    useEffect(() => {
        fetchAdvancedTargets();
    }, []);

    return (
        <div style={{ color: 'black', backgroundColor: 'white', padding: '20px' }}>
            <h1 style={{ fontSize: '48px', color: 'red', textAlign: 'center' }}>Advanced Targets</h1>
            <div style={{ marginTop: '30px' }}>
                {advancedTargets.map(target => {
                    const { title, content } = splitDescription(target.descriptionTarget);
                    return (
                        <div key={target.id_target} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0', padding: '10px', border: '1px solid black', borderRadius: '10px', backgroundColor: '#f8f8f8' }}>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ color: 'black', fontWeight: 'bold', fontSize: '24px' }}>{title}</h2>
                                <p style={{ color: 'black', fontSize: '18px' }}>{content}</p>
                            </div>
                         
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdvancedTargets;
