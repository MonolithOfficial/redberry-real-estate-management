import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Header from './components/header';
import Listings from './components/listings';
import SingleListing from './components/single-listing';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/listing/:id" element={<SingleListing />} />
          <Route path="/" element={<Listings />} />
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
