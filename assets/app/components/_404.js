import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';

const styles = {
  pageContainer: {
    backgroundColor: '#00B8D4',
    height: '100vh'
  },
  _404: {
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
    paddingBottom: 30,
    display: 'flex',
    textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  _404Container: {
    display: 'block',
  },
  _404Text: {
    color: '#00B8D4',
    fontSize: 128,
    fontWeight: 'bold',
  }
};

class _404 extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MuiThemeProvider>
        <div id="_404-page-container" style={styles.pageContainer}>
          <div style={styles._404}>
            <h1 style={styles.headingContainer}>
              <span style={styles.headingText}> NUSCollab </span>
              <span style={styles.subheadingText}>Dashboard</span>
            </h1>
            <Paper zDepth={1} style={styles.contentContainer}>
              <div style={styles._404Container}>
                <h1 id="_404-page-not-found-text" style={styles._404Text}>404</h1>
              </div>
              <Link to="/">
                <RaisedButton id="_404-home-button" label="Go back home" secondary={true} />
              </Link>
            </Paper>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default _404;
