import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode'; // Correctly import jwtDecode as a named export
//import jwtDecode from 'jwt-decode'; // Correct way to import jwtDecode
const ProfilePage = () => {
    const [userInfo, setUserInfo] = useState({ username: '', budget: 0 });
    const [editMode, setEditMode] = useState(false);
    const [editUsernameMode, setEditUsernameMode] = useState(false);
    const [editPasswordMode, setEditPasswordMode] = useState(false);
    const [newBudget, setNewBudget] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                throw new Error('No token found');
            }
            const decoded = jwtDecode(token);
            const userId = decoded.id_user;

            const response = await fetch(`http://localhost:8081/users/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setUserInfo({
                username: data.username || '',
                budget: data.budget || 0
            });
        } catch (error) {
            console.error("There was a problem with fetching user information:", error);
        }
    };

    const handleEditClick = () => {
        setEditMode(true);
        setNewBudget(userInfo.budget);
    };

    const handleBudgetChange = (e) => {
        setNewBudget(e.target.value);
    };

    const handleBudgetSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                throw new Error('No token found');
            }
    
            const decoded = jwtDecode(token);
            const userId = decoded.id_user;
    
            const response = await fetch(`http://localhost:8081/users/updateBudget`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    budget: newBudget
                })
            });
    
            if (!response.ok) {
                throw new Error('Failed to update budget');
            }
    
            // Assuming your server responds with the updated user info, including the new budget
            const updatedUser = await response.json();
            setUserInfo(prevState => ({
                ...prevState,
                budget: updatedUser.budget
            }));
    
            setEditMode(false); // Exit edit mode
        } catch (error) {
            console.error("Error updating user's budget:", error);
        }
    };
    

    const handleUsernameChangeSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                throw new Error('No token found');
            }
    
            const response = await fetch('http://localhost:8081/users/updateUsername', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    newUsername: newUsername,
                })
            });
    
            if (!response.ok) {
                throw new Error('Failed to update username');
            }
    
            const updatedUser = await response.json();
            setUserInfo(prevState => ({
                ...prevState,
                username: updatedUser.username
            }));
    
            setEditUsernameMode(false); // Exit edit mode
            setNewUsername(''); // Reset the new username field
        } catch (error) {
            console.error("Error updating user's username:", error);
        }
    };
    
    const handlePasswordChangeSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                throw new Error('No token found');
            }
    
            const response = await fetch('http://localhost:8081/users/updatePassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                })
            });
    
            if (!response.ok) {
                throw new Error('Failed to update password');
            }
    
            // Reset form fields after successful password change
            setCurrentPassword('');
            setNewPassword('');
            setEditPasswordMode(false); // Exit edit mode
        } catch (error) {
            console.error("Error updating user's password:", error);
        }
    };
    
    
    const profileStyle = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '600px',
            margin: '2em auto',
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
        marginBottom: {
            marginBottom: '-2.5em'
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
        <div style={{...profileStyle.container, ...profileStyle.marginBottom}}>
            <FontAwesomeIcon icon={faUserCircle} size="6x" style={profileStyle.icon} />
            <div>
                <h2 style={profileStyle.infoText}>Username: {userInfo.username}</h2>
                {editUsernameMode ? (
                    <form onSubmit={handleUsernameChangeSubmit}>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            style={inputStyle}
                        />
                        <button type="submit" style={buttonStyle}>Change Username</button>
                    </form>
                ) : (
                    <button onClick={() => setEditUsernameMode(true)} style={buttonStyle}>Edit Username</button>
                )}
    
                {/* Secțiunea pentru Budget */}
                <h2 style={profileStyle.infoText}>
                    Budget: {Number.isNaN(parseFloat(userInfo.budget)) ? '0.00' : parseFloat(userInfo.budget).toFixed(2)} RON
                </h2>
                {editMode ? (
                    <form onSubmit={handleBudgetSubmit}>
                        <input
                            type="number"
                            value={newBudget}
                            onChange={handleBudgetChange}
                            style={inputStyle}
                        />
                        <button type="submit" style={buttonStyle}>Submit</button>
                    </form>
                ) : (
                    <button onClick={handleEditClick} style={buttonStyle}>Edit Budget</button>
                )}
    
                {editPasswordMode ? (
                    <form onSubmit={handlePasswordChangeSubmit}>
                        <input
                            type="password"
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            style={inputStyle}
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={inputStyle}
                        />
                        <button type="submit" style={buttonStyle}>Change Password</button>
                    </form>
                ) : (
                    <button onClick={() => setEditPasswordMode(true)} style={buttonStyle}>Change Password</button>
                )}
            </div>
            
        </div>
    );
    
    
                };
export default ProfilePage;
