import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';

const styles = {
  pageContainer: {
    backgroundColor: '#00B8D4',
    height: '100vh'
  },
  loginContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headingContainer: {
    fontSize: 36,
  },
  headingText: {
    color: '#FAFAFA',
    fontWeight: 'bold'
  },
  subheadingText: {
    color: '#F5F5F5',
  },
  contentContainer: {
    width: 400,
    paddingTop: 30,
    paddingBottom: 30,
    display: 'flex',
    textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textfieldContainer: {
    marginBottom: 30,
  },
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEmpty: true,
      username: '',
      password: '',
      errorText: ''
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.updateEmptyStatus = this.updateEmptyStatus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  updateEmptyStatus() {
    if (!this.state.username && !this.state.password) {
      this.setState({isEmpty: true});
    } else {
      this.setState({isEmpty: false});
    }
  }

  handleUsernameChange(value) {
    this.setState({username: value});
  }

  handlePasswordChange(value) {
    this.setState({password: value});
  }

  onSubmit(e) {
    e.preventDefault();
    let { username, password } = this.state;
    console.log(username, password);
    this.props.authenticateUser(username, password);
  }

  render() {
    let auth = this.props.auth;
    return (
      <MuiThemeProvider>
        <div style={styles.pageContainer}>
          <div style={styles.loginContainer}>
            <h1 style={styles.headingContainer}>
              <span style={styles.headingText}> NUSCollab </span>
              <span style={styles.subheadingText}>Dashboard</span>
            </h1>
            <Paper zDepth={1} style={styles.contentContainer}>
              <div style={styles.textfieldContainer}>
                <div>
                  <TextField
                    id="usernameInput"
                    hintText="Enter username"
                    floatingLabelText="Username"
                    onChange = {(e)=>this.handleUsernameChange(e.target.value)}
                    errorText={this.state.errorText}
                  />
                  <br/>
                  <TextField
                    id="passwordInput"
                    hintText="Enter password"
                    floatingLabelText="Password"
                    onChange = {(e)=>this.handlePasswordChange(e.target.value)}
                    type="password"
                    errorText={this.state.errorText}
                  />
                  <br/>
                </div>
              </div>
              {
                (this.state.username == '' && this.state.password == '') ?
                  <RaisedButton id="loginButton" label="Sign in" disabled={true} />
                : <div>
                  <Link to="/dashboard">
                    <RaisedButton id="loginButton" onClick={(e) => this.onSubmit(e)} label="Sign in" secondary={true} />
                  </Link>
                </div>
              }
              {
                auth && auth.token !== null ?
                  <Redirect to="/dashboard" />
                : null
              }
            </Paper>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Login;
