import React from 'react';
import './LoginButton.css'
import { useNavigate } from 'react-router-dom';



function LoginButton({ userData }) {
    const navigate = useNavigate();
    const handleLoginClick = () => {
        navigate('/Login', { state: { userData }}); 
    };
    return (
        <div className="LoginButton">
            <i className="icon-login" onClick={handleLoginClick}></i>
            <span>Login</span>
        </div>
    );
}
export default LoginButton;
