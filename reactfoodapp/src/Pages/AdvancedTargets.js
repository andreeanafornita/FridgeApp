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
    const onAddTargetClick = async (id_target) => {
        const token = localStorage.getItem('jwtToken'); // Obține tokenul JWT stocat local
        console.log('Token used for request:', token);
        try {
            const response = await fetch('http://localhost:8081/yourTargets/addYourTarget', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` // Include tokenul JWT aici
                },
                body: JSON.stringify({ id_target })
              });
              console.log('Request sent to /yourTargets/addYourTarget with ID:', id_target);
    
            if (!response.ok) {
                throw new Error('Failed to add target to Your Targets');
            }
    
            // Opcțional: Actualizează lista de targeturi din componenta "Your Targets"
            // Aceasta poate fi realizată prin apelarea unei funcții de actualizare sau printr-un mesaj global (e.g., folosind Context API sau Redux)
            alert('Target added successfully to Your Targets!'); // Mesaj de succes
        } catch (error) {
            console.error("Error adding target to Your Targets:", error);
            alert('Error adding target to Your Targets.'); // Mesaj de eroare
        }
    };
    const profileStyle = {
   
        marginBottom: {
            marginBottom: '6em'
        },
    };
    return (
        <div style={{ color: 'black', backgroundColor: 'white', padding: '20px',...profileStyle.marginBottom }}>
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
                            <button
                                style={{
                                    backgroundColor: 'red',
                                    color: 'white',
                                    borderRadius: '5px',
                                    padding: '10px 15px',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                                onClick={() => onAddTargetClick(target.id_target)}
                            >
                                Add
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdvancedTargets;
