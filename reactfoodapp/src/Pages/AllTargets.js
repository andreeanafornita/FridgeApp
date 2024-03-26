import React, { useEffect, useState } from 'react';
// Import any additional libraries you might need


const AllTargets = () => {
    const [allTargets, setAllTargets] = useState([]); // State to store all targets data
    const [expandedTargetId, setExpandedTargetId] = useState(null); // New state to keep track of expanded target


    // Simulating a function to fetch all targets from backend
    const fetchAllTargets = async () => {
        const token = localStorage.getItem('jwtToken'); // Preia tokenul JWT stocat local
        try {
            const response = await fetch('http://localhost:8081/alltargets/get', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include tokenul JWT în headers
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setAllTargets(data);
        } catch (error) {
            console.error("There was a problem with fetching targets:", error);
        }
    };
    
    


    // Function to toggle the expanded state of a target's description
    const toggleDescription = (id_target,event) => {
        event.stopPropagation();
        setExpandedTargetId(expandedTargetId === id_target ? null : id_target);
    };


    useEffect(() => {
        fetchAllTargets(); // Fetch all targets on component mount
    }, []);

    const getFormattedDescription = (description, isExpanded) => {
        if (!isExpanded) {
            const firstLineEndIndex = description.indexOf('\n') > -1 ? description.indexOf('\n') : 20;
            return { title: description.substring(0, firstLineEndIndex), rest: '...' };
        }
        const firstLineEndIndex = description.indexOf('\n');
        const title = description.substring(0, firstLineEndIndex > -1 ? firstLineEndIndex : description.length);
        const rest = firstLineEndIndex > -1 ? description.substring(firstLineEndIndex + 1) : '';
        return { title, rest };
    };
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
            marginBottom: '-10em'
        },
    };
    return (
        <div style={{ color: 'black', backgroundColor: 'white', padding: '20px',...profileStyle.marginBottom }}>
            <h1 style={{ fontSize: '48px', color: 'red', textAlign: 'center' }}>All Targets</h1>
            <div style={{ marginTop: '30px' }}>
                {allTargets.map(target => {
                    const { title, rest } = getFormattedDescription(target.descriptionTarget, expandedTargetId === target.id_target);
                    return (
                        <div 
                            key={target.id_target} 
                            style={{ 
                                margin: '20px 0', 
                                padding: '10px', 
                                border: '1px solid black', 
                                borderRadius: '10px', 
                                backgroundColor: '#f8f8f8', 
                                position: 'relative', 
                                cursor: 'pointer'
                            }} 
                            onClick={(event) => toggleDescription(target.id_target, event)}
                        >
                            <div style={{ marginBottom: '30px' }}>
                                <p style={{ 
                                    margin: 0,
                                    whiteSpace: 'pre-wrap',
                                    overflow: 'hidden',
                                    height: expandedTargetId === target.id_target ? 'auto' : '20px',
                                    transition: 'height 0.3s'
                                }}>
                                    <span style={{ color: 'black', fontWeight: 'bold', fontSize: '20px', display: 'block' }}>{title}</span>
                                    <span style={{ color: 'grey', display: expandedTargetId === target.id_target ? 'block' : 'none' }}>{rest}</span>
                                </p>
                            </div>
                            <button 
                                style={{ 
                                    position: 'absolute', 
                                    left: '1180px',
                                    bottom: '10px', 
                                    backgroundColor: 'red', 
                                    color: 'white', 
                                    borderRadius: '50%', 
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

export default AllTargets;
