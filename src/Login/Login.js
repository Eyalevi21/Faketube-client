import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({userData, setUserData}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
            const res = await fetch('http://localhost:880/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            console.log('Response:', res);
            if (res.ok) {
                const result = await res.json();
                console.log('Response:', result);
                // Set the user data (username, password, and profile)
               const user = { username: result.username,
                    nickname: result.nickname, // Optionally store this, depending on your app logic
                    profile: result.profilePicture}            
                    {setUserData(user)};
           
    
                // Navigate to the home page
                navigate('/');
            } else {
                const errorResult = await res.json();
                setError(errorResult.message || 'Login failed');
            }
        } catch (error) {
            console.log("the error: ", error)
            setError('Something went wrong. Please try again.');
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
