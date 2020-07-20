import React from 'react';
import './App.css';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import VolunteerPage from './components/pages/Volunteers';
import NavBar from './components/header/Navbar';
import Login from './components/pages/Login';
import NewsletterCreationPage from './components/pages/Newsletter';
import ContactsPage from './components/pages/Contacts';
import UploadContactsPage from './components/pages/UploadContacts';
import NewsletterHistoryPage from './components/pages/NewsletterHistory';

function App() {
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route path="/login" component={Login}></Route>
        <Route exact path="/newsletter" component={NewsletterHistoryPage} />
        <Route
          exact
          path="/newsletter/create"
          component={NewsletterCreationPage}
        />
        <Route exact path="/contacts" component={ContactsPage} />
        <Route exact path="/upload" component={UploadContactsPage} />
        <Route exact path="/" component={VolunteerPage}></Route>
      </Switch>
    </Router>
  );
}

export default App;
