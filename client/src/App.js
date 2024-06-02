import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import MRIupload from './Components/MRIupload';
import AnalysisResult from './Components/AnalysisResult';
import Login from './Components/Login';
import HeaderComponent from './Components/HeaderComponent';

// Wrap HeaderComponent to include an <Outlet> where child routes will render
function HeaderWithOutlet() {
  return (
    <HeaderComponent>
      <Outlet />
    </HeaderComponent>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<HeaderWithOutlet />}>
            <Route path="submission" element={<MRIupload />} />
            <Route path="display" element={<AnalysisResult />} />
          </Route>
        </Routes>     
      </BrowserRouter>
    </div>
  );
}

export default App;
