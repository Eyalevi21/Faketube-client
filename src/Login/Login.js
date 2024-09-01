import { useState } from "react";
import './Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [profilePicture, setProfilePicture] = useState(null); // State to store the profile picture

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
        
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {
            username: username,
            password: password
        };
        const res = await fetch('http://localhost:880/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            const result = await res.json();
            setProfilePicture(result.profilePicture); // Assuming the server returns the profile picture
        } else {
            const errorResult = await res.json();
            setError(errorResult.message || 'Login failed');
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
                {profilePicture && (
                    <div className="profile-picture-container">
                        <h3>Welcome, {username}!</h3>
                        <img src={profilePicture} alt="Profile" className="profile-picture" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;
