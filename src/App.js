import { useState } from 'react';
import './App.css';
import Login from './Login/Login.js';
import Reg from './Register/Reg.js';
import HomePage from './HomePage/HomePage.js';
import Welcome from './Welcome.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
  const [userData, setUserData] = useState(null);
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element= {<HomePage userData = {userData} setUserData={setUserData}/> }/>
      <Route path="/login" element={<Login userData = {userData} setUserData={setUserData}/> } />
      <Route path="/register" element={<Reg/> } />
      <Route path="/welcome" element={<Welcome/> } />  
    </Routes>
  </BrowserRouter>
  );
}

export default App;
