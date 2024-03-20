import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode'; // Correctly import jwtDecode as a named export
//import jwtDecode from 'jwt-decode'; // Correct way to import jwtDecode
const ProfilePage = () => {
    const [userInfo, setUserInfo] = useState({ username: '', budget: 0 });
    const [editMode, setEditMode] = useState(false); // Pentru a controla afișarea formularului de editare
    const [newBudget, setNewBudget] = useState('');
    const fetchUserInfo = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                throw new Error('No token found');
            }
            // Decode the token to get the user ID
            const decoded = jwtDecode(token);
            const userId = decoded.id_user; // Replace 'id' with the actual key where the user ID is stored in your JWT payload

            const response = await fetch(`http://localhost:8081/users/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setUserInfo({ username: data.username || '', // Use || '' to default to an empty string if undefined
            budget: data.budget || 0 });
        } catch (error) {
            console.error("There was a problem with fetching user information:", error);
        }
    };

    useEffect(() => {
        fetchUserInfo(); // Fetch user info on component mount
    }, []);
    const handleEditClick = () => {
        setEditMode(true); // Activează modul de editare
        setNewBudget(userInfo.budget); // Inițializează input-ul cu bugetul actual
    };

    const handleBudgetChange = (e) => {
        setNewBudget(e.target.value); // Actualizează valoarea introdusă de utilizator
    };

    const handleBudgetSubmit = async (e) => {
        e.preventDefault(); // Prevenirea reîncărcării paginii
    
        try {
            const token = localStorage.getItem('jwtToken'); // Preia tokenul JWT din localStorage
            if (!token) {
                throw new Error('No token found');
            }
    
            // Decode the token to get the user ID
            const decoded = jwtDecode(token);
            const userId = decoded.id_user; // Asumând că `id_user` este cheia în payload-ul JWT unde este stocat ID-ul utilizatorului
    
            const response = await fetch(`http://localhost:8081/users/updateBudget`, {
                method: 'PUT', // Metoda HTTP pentru actualizare
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include tokenul JWT în antet pentru autentificare
                },
                body: JSON.stringify({
                    budget: newBudget // Corpul cererii cu noul buget
                })
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const updatedUserInfo = await response.json(); // Preia răspunsul actualizat de la server
    
            setUserInfo({ // Actualizează starea locală cu noile informații ale utilizatorului
                ...userInfo,
                budget: updatedUserInfo.budget
            });
            
            setEditMode(false); // Deactivează modul de editare după actualizare
        } catch (error) {
            console.error("Error updating user's budget:", error);
        }
    };
    
    const profileStyle = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '600px',
            margin: '5em auto',
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#f3f3f3',
            borderRadius: '15px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease-in-out',
            ':hover': {
                transform: 'translateY(-10px)',
                boxShadow: '0 6px 12px rgba(0,0,0,0.4)'
            },
            backgroundImage: 'linear-gradient(to right, #ff0000, #000000)', // Gradient background with red shades
            border: '1px solid rgba(255, 255, 255, 0.6)',
        },
        icon: {
            color: '#000', // Black color for the icon
            margin: '20px 0',
            fontSize: '3em',
            animation: 'iconPulse 2s infinite',
            '@keyframes iconPulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.2)' }
            }
        },
        infoText: {
            margin: '10px 0',
            fontSize: '20px',
            color: '#fff',
            fontWeight: '500',
            letterSpacing: '1px',
            lineHeight: '1.6',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
        },
        
    };
    
    const buttonStyle = {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        margin: '10px 0', // Ajustează spațiul în jurul butonului
        color: '#FFFFFF', // Text alb
        background: 'linear-gradient(45deg, #ff0000, #000000)', // Gradient similar cu container-ul
        transition: 'transform 0.2s ease-in-out', // Efect de tranziție pentru hover
    };
    
    const submitButtonStyle = {
        ...buttonStyle,
        // Poti adauga aici stiluri specifice doar pentru butonul de submit dacă este necesar
    };
    
    const inputStyle = {
        padding: '10px',
        margin: '20px 0',
        border: '2px solid #FFFFFF', // Border alb pentru a se potrivi cu schema de culori
        borderRadius: '5px',
        width: 'calc(100% - 24px)', // Ajustează lățimea pentru a se potrivi cu padding-ul
        boxSizing: 'border-box', // Asigură-te că padding-ul și border-ul sunt incluse în lățimea totală
    };
    
    const textStyle = {
        ...profileStyle.infoText,
        fontSize: '22px', // Mărește dimensiunea fontului pentru o mai bună lizibilitate
        letterSpacing: '2px', // Mărește spațiul dintre litere
        textTransform: 'uppercase', // Text uppercase pentru un look mai modern
    };
    const budget = parseFloat(userInfo.budget);
    return (
        <div style={profileStyle.container}>
            <FontAwesomeIcon icon={faUserCircle} size="6x" style={profileStyle.icon} />
            <div>
                <h2 style={profileStyle.infoText}>Username: {userInfo.username}</h2>
                {editMode ? (
                    <form onSubmit={handleBudgetSubmit}>
                        <input 
                       
                            type="number" 
                            value={newBudget} 
                            onChange={handleBudgetChange} 
                            style={inputStyle}
                        />
                        <button type="submit" style={submitButtonStyle}>Submit</button>
                    </form>
                ) : (
                    <>
                     <h2 style={profileStyle.infoText}>Budget: {Number.isNaN(budget) ? '0.00' : budget.toFixed(2)} RON</h2>
                        <button onClick={handleEditClick}style={buttonStyle}>Change Budget</button>
                    </>
                )}
            </div>
        </div>
    );

    // return (
    //     <div style={profileStyle.container}>
    //         <FontAwesomeIcon icon={faUserCircle} size="6x" style={profileStyle.icon} />
    //         <div>
    //             <h2 style={profileStyle.infoText}>Username: {userInfo.username}</h2>
    //             <h2 style={profileStyle.infoText}>Budget: {userInfo.budget.toFixed(2)} RON</h2>
    //             {/* Additional user information can be added here */}
    //         </div>
    //     </div>
    // );
};

export default ProfilePage;
