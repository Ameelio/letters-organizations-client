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
import AuthorizedRoute from './hoc/AuthorizedRoute';

function App() {
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route path="/login" component={Login}></Route>
        <AuthorizedRoute
          exact
          path="/newsletter"
          component={NewsletterHistoryPage}
        />
        <AuthorizedRoute
          exact
          path="/newsletter/create"
          component={NewsletterCreationPage}
        />
        <AuthorizedRoute exact path="/contacts" component={ContactsPage} />
        <AuthorizedRoute exact path="/upload" component={UploadContactsPage} />
        <AuthorizedRoute exact path="/" component={VolunteerPage} />
      </Switch>
    </Router>
  );
}

export default App;
