import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({userData, setUserData }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState(() => localStorage.getItem('jwt') || null);
    const navigate = useNavigate();
    useEffect(() => {
        if (token) {
          // Token and userData exist, show custom notification and navigate to home
          alert('You are already signed in. Redirecting to home')  
          // Delay for 3 seconds before navigating
          navigate('/');
        }         
      }, [navigate]);
    const handleUserChange = (e) => {
        setUsername(e.target.value);
        setError('');
    };

    const handlePassChange = (e) => {
        setPassword(e.target.value);
        setError('');
    };

    const handleUserFocus = () => {
        if (username === 'Enter username') {
            setUsername('');
        }
    };

    const handlePassFocus = () => {
        if (password === 'Enter password') {
            setPassword('');
        }
    };

    const handleRegClick = () => {
        navigate('/register');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {
            username: username,
            password: password
        };
    
        try {
            const res = await fetch('http://localhost:880/api/tokens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(data)
            });
    
            const result = await res.json();
    
            if (res.ok) {
                localStorage.setItem('jwt', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));                
                setUserData(result.user);
                navigate('/');
            } else {
                setError(result.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred during login');
            console.error('Error logging in:', err);
        }
    };


    return (
        <div className="full-height-log">
            <div className="center-rectangle-log">
                <h2>Login to FakeTube</h2>
                <form className="row g-3 needs-validation" noValidate onSubmit={handleSubmit}>
                    <div className="col-md-12">
                        <input
                            type="text"
                            className="form-control"
                            id="validationCustom01"
                            value={username}
                            placeholder="Enter username"
                            onFocus={handleUserFocus}
                            onChange={handleUserChange}
                            required
                        />
                    </div>
                    <div className="col-md-12">
                        <input
                            type="password"
                            className="form-control"
                            id="validationCustom02"
                            value={password}
                            placeholder="Enter password"
                            onFocus={handlePassFocus}
                            onChange={handlePassChange}
                            required
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <div className="button-container-log">
                        <button className="btn btn-primary" id="registerbtn-log" type="submit">Sign in</button>
                        <div className="register-section-log">
                            <button className="btn btn-secondary" id="register-link-log" onClick={handleRegClick} >Register </button>
                            <p>Doesn't have an account?</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
