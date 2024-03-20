import  { React,useEffect, useState } from 'react';
//import AllTargets from './backend/models/AllTargets.js';

const YourTargets = () => {
    const [yourTargets, setYourTargets] = useState([]);
    const [expandedTargetId, setExpandedTargetId] = useState(null);

    const fetchYourTargets = async () => {
        const token = localStorage.getItem('jwtToken');
        //console.log("Token before fetch:", token);
        //console.log("Fetching yourTargets from server");
        try {
            const response = await fetch('http://localhost:8081/yourTargets/getYourTargets', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            //console.log("Received yourTargets data:", data); 
            setYourTargets(data);
            //console.log('Set your targets: ',data);
        } catch (error) {
            console.error("There was a problem with fetching your targets:", error);
        }
    };
    const toggleDescription = (id_target, event) => {
        event.stopPropagation();
        setExpandedTargetId(expandedTargetId === id_target ? null : id_target);
    };

    useEffect(() => {
        fetchYourTargets();
        console.log("Initial yourTargets state:", yourTargets);
    }, []);

    const getFormattedDescription = (description, isExpanded) => {
        if (description) {
            if (!isExpanded) {
                const firstLineEndIndex = description.indexOf('\n') > -1 ? description.indexOf('\n') : 20;
                return { title: description.substring(0, firstLineEndIndex), rest: '...' };
            }
            const firstLineEndIndex = description.indexOf('\n');
            const title = description.substring(0, firstLineEndIndex > -1 ? firstLineEndIndex : description.length);
            const rest = firstLineEndIndex > -1 ? description.substring(firstLineEndIndex + 1) : '';
            return { title, rest };
        } else {
            return { title: "No description", rest: "" };
        }
    };
    const handleDeleteTarget = async (id) => {
        const token = localStorage.getItem('jwtToken');
        try {
            const response = await fetch(`http://localhost:8081/yourTargets/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    //'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                console.log(id)
                throw new Error('Network response was not ok');
            }
            // Reîncarcă lista de target-uri după ștergere
            fetchYourTargets();
        } catch (error) {
            console.error("There was a problem with deleting the target:", error);
        }
    };
    
    return (
        <div style={{ color: 'black', backgroundColor: 'white', padding: '20px' }}>
            <h1 style={{ fontSize: '48px', color: 'red', textAlign: 'center' }}>Your Targets</h1>
            <div style={{ marginTop: '30px' }}>
                {yourTargets.length > 0 ? yourTargets.map(target => {
                    const { title, rest } = getFormattedDescription(target.descriptionTarget, expandedTargetId === target.id_target);
                    return (
                        <div 
                            key={target.id_yourTargets} 
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
                            <button
                                onClick={(event) => {
                                    event.stopPropagation();
                                    
                                    handleDeleteTarget(target.allTargetsID_your);
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '18px',
                                    left: '1200px',
                                    padding: '5px 10px',
                                    background: 'red',
                                    color: 'white',
                                    border: 'black',
                                    borderRadius: '15px',
                                    cursor: 'pointer',
                                   

                                }}
                            >
                                Delete
                            </button>
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
                    );
                }) : <p style={{ textAlign: 'center' }}>You didn't select any target.</p>}
            </div>
        </div>
    );
};

export default YourTargets;
