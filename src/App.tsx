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
import DraftsPage from './components/pages/Drafts';
import PrivateRoute from './hoc/PrivateRoute';
import { loadSegment, track } from 'src/utils/segment';

import { connect, ConnectedProps } from 'react-redux';
import { RootState } from './redux';

const mapStateToProps = (state: RootState) => ({
  session: state.session,
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

const App: React.FC<PropsFromRedux> = ({ session }) => {
  loadSegment();

  const isAndrew = session.user.email === 'acarloslama@gmail.com';
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route path="/login" component={Login}></Route>
        {isAndrew && (
          <PrivateRoute
            exact
            path="/newsletter"
            component={NewsletterHistoryPage}
          />
        )}
        {isAndrew && (
          <PrivateRoute
            exact
            path="/newsletter/create"
            component={NewsletterCreationPage}
          />
        )}
        <PrivateRoute exact path="/drafts" component={DraftsPage} />
        {isAndrew && (
          <PrivateRoute exact path="/contacts" component={ContactsPage} />
        )}
        {isAndrew && (
          <PrivateRoute exact path="/upload" component={UploadContactsPage} />
        )}
        <PrivateRoute exact path="/" component={VolunteerPage} />
      </Switch>
    </Router>
  );
};

export default connector(App);
