import React, { Component, PropTypes } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Dashboard from '../components/Dashboard';

export class DashboardPage extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    let auth = this.props.auth;
    let jwtToken = auth.jwtToken;
    if (jwtToken == null || jwtToken == '') {
      this.props.history.push('/');
    }
  }

  render() {
    return (
      <Dashboard isAdmin={this.props.auth.isAdmin} />
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  null
)(DashboardPage);
