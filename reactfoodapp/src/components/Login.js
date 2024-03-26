import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import backgroundImage from '../images/logo_rosu.png';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8081/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        
        navigate('/home');
        
        localStorage.setItem("jwtToken", data.token);
        console.log('Login succesful',data.token);
      } else {
        // Set error message from response
        setError(data.message || 'An unknown error occurred');
      }
    } catch (error) {
      setError('Network error, please try again later.');
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault(); // Prevent default anchor link behavior
    navigate('/register'); // Correct usage to navigate programmatically
  };
  

  const centerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '90vh',
    backgroundColor: '#FFFFFF', // Changed to white background
  };
  const backgroundStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '95vh', // Asigură-te că pagina are înălțimea completă a viewport-ului
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: '100% auto', // Scala imaginea pe lățime, menține proporțiile
  backgroundPosition: 'center center', 
    backgroundRepeat: 'no-repeat',
   
  };
  

  
  const cardStyle = {
    backgroundColor: '#FFEEEE', // Changed to very light red
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    border: '7px solid black',
    width: '100%',
    maxWidth: '450px',
    margin: 'auto',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };
  
 
  const titleStyle = {
    fontWeight: 'bold', // Make the title bold
    fontSize: '20px', // Increase the font size of the title
    //textAlign: 'center', // Center the title text
    marginBottom: '2rem', // Space below the title
  };
  const labelStyle = {
    color: 'black',
    display: 'block', // Make the label a block element to take up full width
    marginBottom: '1px', // Increase spacing between label and input
  };
  const submitButtonStyle = {
    backgroundColor: '#56b72d', // Example: red background
    color: 'black', // White text
    fontWeight: 'bold', // Bold text
    padding: '10px 20px', // Larger padding for a bigger button
    border: 'none', // Remove the border
    borderRadius: '10px', // Rounded corners
    fontSize: '16px', // Larger font size
    cursor: 'pointer', // Cursor to pointer to indicate clickable
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Shadow for depth
    // Add any additional styles you want for the button
    width: '100%',
  };
  const inputStyle = {
    backgroundColor: 'white',
    color: 'black', // Text in inputs is black
    borderColor: 'grey', // Added red border for inputs
    borderWidth: '2px', // Make input border thicker
    borderStyle: 'solid',
    marginBottom: '1rem', // Increase spacing after the input
  };
  
  const linkStyle = {
    color: '#007BFF', // Changed link color to blue
    textDecoration: 'none',
    fontWeight: 'bold' ,
  };
  
  const errorStyle = {
    color: 'red', 
    marginBottom: '10px',
  };
 
  return (
    <div style={backgroundStyle}>
    <div style={centerStyle}>
      <div className="login-container" style={cardStyle}>
        <Card title='Login' className="card" style={titleStyle}>
          <div>
          
          <div className="p-fluid" style={{ marginBottom: '20px' }}>
            <div className="p-field">
              <label htmlFor="username" style={labelStyle}>Username</label>
              <InputText
                id="username"
                name="username"
                onChange={(e) => setUsername(e.target.value)}
                style={inputStyle}
                autoComplete="username" // Corrected autoComplete value
              />
            </div>
            <div className="p-field">
              <label htmlFor="password" style={labelStyle}>Password</label>
              <InputText
                id="password"
                name="password"
                type="password"
                autoComplete="current-password" // Corrected autoComplete value
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
  
          <div className="register-link" style={{ marginBottom: '20px', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
            Don't have an account? <a href="#register" onClick={handleRegisterClick} style={linkStyle}>Register</a> {/* Changed href to prevent default page navigation */}
          </div>
          {error && <div style={errorStyle}>{error}</div>}
          <Button id="loginBtn" label="Submit" style={submitButtonStyle} onClick={handleSubmit} />
          </div>
        </Card>
      </div>
    </div>
    </div>
  );
  
};

export default Login;
