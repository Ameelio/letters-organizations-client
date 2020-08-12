import { Route, Redirect, RouteProps } from 'react-router';
import { connect } from 'react-redux';
import { RootState } from '../redux';
import React from 'react';

interface Props extends RouteProps {
  authenticated: boolean;
}

class PrivateRoute extends Route<Props> {
  public render() {
    if (!this.props.authenticated) {
      const renderComponent = () => <Redirect to="/login" />;
      return <Route {...this.props} component={renderComponent} />;
    } else {
      return <Route {...this.props} />;
    }
  }
}

const mapStateToProps = (state: RootState) => ({
  authenticated: state.user.authInfo.isLoggedIn,
});

export default connect(mapStateToProps)(PrivateRoute);
