
import './App.css';
import Login from './Login/Login.js';
import Reg from './Register/Reg.js';

import Welcome from './Welcome.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/> } />
      <Route path="/register" element={<Reg/> } />
      <Route path="/welcome" element={<Welcome/> } />  
    </Routes>
  </BrowserRouter>
  );
}

export default App;
