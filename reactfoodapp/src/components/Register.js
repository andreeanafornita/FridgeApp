import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../images/logo_rosu.png';
const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        repeatPassword: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Inline styles
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f0f0f0',
        },
        title: {
            color: '#333',
            marginBottom: '20px',
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '400px',
            width: '100%',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        field: {
            marginBottom: '15px',
        },
        label: {
            marginBottom: '5px',
        },
        input: {
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '16px',
        },
        submitButton: {
            padding: '10px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#007bff',
            color: '#fff',
            fontSize: '16px',
            cursor: 'pointer',
        },
        error: {
            color: 'red',
            textAlign: 'center',
            marginBottom: '10px',
        },
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      localStorage.removeItem('jwtToken');
      if (formData.password !== formData.repeatPassword) {
        setError("Passwords don't match!");
        return;
      }
    
      try {
        const response = await fetch('http://localhost:8081/users/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });
    
        const data = await response.json();
    
        if (response.ok) {
          console.log('User registered/login successful:', data);
          localStorage.setItem('jwtToken', data.token);
          console.log('Token stored:', localStorage.getItem('jwtToken'));
          navigate('/home'); // Make sure useNavigate hook from react-router-dom is being utilized here.
        } else {
          setError(data.message || "Failed to register");
        }
      } catch (error) {
        setError("Failed to connect to the server");
        console.error('Registration error:', error);
      }
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'white', // Background color similar to your login page
      };
    
      const formContainerStyle = {
        backgroundColor: '#FFEEEE', // Changed to very light red
        padding: '18px',
        borderRadius: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        border: '7px solid black',
        width: '100%',
        maxWidth: '400px',
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
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#333',
        fontWeight: 'bold',
      };
    
      const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        color: '#333',
      };
    
      const inputStyle = {
        width: '100%',
        padding: '10px',
        marginBottom: '1.5rem',
        border: '1px solid #ccc',
        borderRadius: '4px',
      };
    
      const buttonStyle = {
        width: '100%',
        padding: '10px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#56b72d',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
        marginBottom: '1rem',
      };
    
      const errorStyle = {
        color: 'red',
        textAlign: 'center',
        marginBottom: '1rem',
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
    
      // JSX
      return (
        <div style={backgroundStyle}>
        <div style={containerStyle}>
          <div style={formContainerStyle}>
            <h2 style={titleStyle}>Register</h2>
            <div>
              <label style={labelStyle} htmlFor="username">Username</label>
              <input
                style={inputStyle}
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="off"
               // autocomplete="off" // Added autoComplete attribute
              />
            </div>
            <div>
              <label style={labelStyle} htmlFor="password">Password</label>
              <input
                style={inputStyle}
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="off"
                //autocomplete="off" // Added autoComplete attribute
              />
            </div>
            <div>
              <label style={labelStyle} htmlFor="repeatPassword">Repeat Password</label>
              <input
                style={inputStyle}
                type="password"
                id="repeatPassword"
                name="repeatPassword"
                value={formData.repeatPassword}
                onChange={handleChange}
                required
                autoComplete="off"
               // autocomplete="off" // Added autoComplete attribute
              />
            </div>
            {error && <p style={errorStyle}>{error}</p>}
            <button id='registerBtn' style={buttonStyle} onClick={handleSubmit}>Register</button>
          </div>
        </div>
        </div>
      );
      
};

export default RegisterForm;