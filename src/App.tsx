import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import VolunteerPage from './components/pages/Volunteers';
import NavBar from './components/header/Navbar';
import Login from './components/pages/Login';

function App() {
  return (
    <Router>
      <NavBar />
      <Route path="/login" component={Login}></Route>
      <Route exact path="/" component={VolunteerPage}></Route>
    </Router>
  );
}

export default App;
