import React, { Component } from 'react';
import { connect } from 'react-redux';

import Navigation from '../components/Navigation';

import {
  changeContentType,
  unauthenticateUser
} from '../actions/actions';

export class NavigationMenu extends Component {

  changeContentType = (contentType) => {
    this.props.changeContentType(contentType);
  }

  unauthenticateUser = () => {
    this.props.unauthenticateUser();
  }

  render() {
    console.log(this.props.isAdmin);
    return (
      <Navigation isAdmin={this.props.isAdmin} 
                  changeContentType={this.changeContentType} 
                  unauthenticateUser={this.unauthenticateUser}/>
    )
  };
}

const mapStateToProps = (state, ownProps) => ({
  isAdmin: state.auth.isAdmin
});

const mapDispatchToProps = {
  changeContentType,
  unauthenticateUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationMenu);
