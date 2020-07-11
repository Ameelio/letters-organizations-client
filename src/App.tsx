import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import VolunteerPage from './pages/Volunteers';
import NavBar from './components/Navbar';

function App() {
  return (
    <Router>
      <NavBar/>
      <Route path="/" component={VolunteerPage}></Route>
    </Router>
  );
}

export default App;
