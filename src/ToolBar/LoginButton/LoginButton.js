import React from 'react';
import './LoginButton.css'
import { useLocation, useNavigate } from 'react-router-dom';



function LoginButton({ videoList, userData }) {
    const navigate = useNavigate();
    const handleLoginClick = () => {
        navigate('/Login', { state: { userData, videoList }}); 
    };
    return (
        <div className="LoginButton">
            <i className="icon-login" onClick={handleLoginClick}></i>
            <span>Login</span>
        </div>
    );
}
export default LoginButton;
