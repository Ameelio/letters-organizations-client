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
import PrivateRoute from './hoc/PrivateRoute';

function App() {
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route path="/login" component={Login}></Route>
        <PrivateRoute
          exact
          path="/newsletter"
          component={NewsletterHistoryPage}
        />
        <PrivateRoute
          exact
          path="/newsletter/create"
          component={NewsletterCreationPage}
        />
        <PrivateRoute exact path="/contacts" component={ContactsPage} />
        <PrivateRoute exact path="/upload" component={UploadContactsPage} />
        <PrivateRoute exact path="/" component={VolunteerPage} />
      </Switch>
    </Router>
  );
}

export default App;
