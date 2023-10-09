import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import App from './App'; 

function Main() {
  const [user, setUser] = useState(null); //context

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<App setUser={setUser} />} />
        <Route path="/" element={<Home user={user} />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);