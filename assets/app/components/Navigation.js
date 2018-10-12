import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import DashboardIcon from 'material-ui/svg-icons/action/account-balance';
import ProjectsIcon from 'material-ui/svg-icons/social/group';
import UsersIcon from 'material-ui/svg-icons/social/person';
import MilestonesIcon from 'material-ui/svg-icons/places/golf-course';
import TasksIcon from 'material-ui/svg-icons/action/list';
import CloudIcon from 'material-ui/svg-icons/file/cloud';
import SettingsIcon from 'material-ui/svg-icons/action/build';
import LogoutIcon from 'material-ui/svg-icons/action/power-settings-new';

import { Link } from 'react-router-dom';

const styles = {
  subheader: {
    marginLeft: -8,
    color: '#00B8D4',
    fontSize: 13,
  },
  listItem: {
    fontSize: 16,
    padding: '8px 0px 8px 18px',
    textOverflow: 'ellipsis',
    maxWidth: 'inherited',
  },
  leftPanelContainer: {
    paddingTop: 66,
    height: '100%',
  },
  iconSize: {
    width: 24,
    height: 24,
  },
  linkDecoration: {
    textDecoration: 'none',
  },
};


class Navigation extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const GithubIcon =
      <svg style={styles.iconSize} viewBox="0 0 24 24">
        <path fill="#757575" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
      </svg>
    const GoogleDriveIcon =
      <svg style={styles.iconSize} viewBox="0 0 24 24">
          <path fill="#757575" d="M7.71,3.5L1.15,15L4.58,21L11.13,9.5M9.73,15L6.3,21H19.42L22.85,15M22.28,14L15.42,2H8.58L8.57,2L15.43,14H22.28Z" />
      </svg>
    return (
      <MuiThemeProvider>
        <Paper zDepth={1} style={styles.leftPanelContainer}>
          <List>
            <Subheader style={styles.subheader}>GENERAL</Subheader>
            <div id="navigationHome">
              <Link to="/dashboard/" style={styles.linkDecoration} onClick={() => this.props.changeContentType('Home')}>
                <ListItem primaryText="Home" leftIcon={<DashboardIcon />} />
              </Link>
            </div>
            <div id="navigationProjects">
              <Link to="/dashboard/projects" style={styles.linkDecoration} onClick={() => this.props.changeContentType('Projects')}>
                <ListItem primaryText="Projects" leftIcon={<ProjectsIcon />} />
              </Link>
            </div>
            <div id="navigationUsers">
              <Link to="/dashboard/users" style={styles.linkDecoration} onClick={() => this.props.changeContentType('Users')}>
                <ListItem primaryText="Users" leftIcon={<UsersIcon />} />
              </Link>
            </div>
            { this.props.isAdmin ? <div id="navigationStaffs">
              <Link to="/dashboard/staffs" style={styles.linkDecoration} onClick={() => this.props.changeContentType('Staffs')}>
                <ListItem primaryText="Staffs" leftIcon={<UsersIcon />} />
              </Link>
            </div> : null}
          </List>
          <Divider />
          <List>
            <Subheader style={styles.subheader}>GLOBAL FEATURES</Subheader>
            <div id="navigationGithub">
              <Link to="/dashboard/github" style={styles.linkDecoration} onClick={() => this.props.changeContentType('Github')}>
                <ListItem primaryText="Github" leftIcon={GithubIcon} />
              </Link>
            </div>
            <div id="navigationDrive">
              <Link to="/dashboard/drive" style={styles.linkDecoration} onClick={() => this.props.changeContentType('Google Drive')}>
                <ListItem primaryText="Google Drive" leftIcon={GoogleDriveIcon} />
              </Link>
            </div>
            <div id="navigationMilestones">
              <Link to="/dashboard/milestones" style={styles.linkDecoration} onClick={() => this.props.changeContentType('Milestones')}>
                <ListItem primaryText="Milestones" leftIcon={<MilestonesIcon />} />
              </Link>
            </div>
            <div id="navigationTasks">
              <Link to="/dashboard/tasks" style={styles.linkDecoration} onClick={() => this.props.changeContentType('Tasks')}>
                <ListItem primaryText="Tasks" leftIcon={<TasksIcon />} />
              </Link>
            </div>
          </List>
          <Divider />
          <List>
            <Subheader style={styles.subheader}>ADMIN</Subheader>
            <div id="navigationLogout">
              <Link to="/" style={styles.linkDecoration} onClick={() => this.props.unauthenticateUser()}>
                <ListItem primaryText="Logout" leftIcon={<LogoutIcon />} />
              </Link>
            </div>
          </List>
        </Paper>
      </MuiThemeProvider>
    );
  }
}

export default Navigation;
