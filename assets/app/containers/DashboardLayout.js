import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import Content from '../components/Content';
import HeadingContainer from '../components/HeadingContainer';
import Heading from '../components/Heading';

import HomePage from './HomePage';
import ProjectsPage from './ProjectsPage';
import UsersPage from './UsersPage';

import GithubPage from './GithubPage';
import GoogleDrivePage from './GoogleDrivePage';
import MilestonesPage from './MilestonesPage';
import TasksPage from './TasksPage';

import {
  getTotalUsers,
  getNewUsers,
  getActiveUsers,
  getInactiveUsers,
  getRetentionRate,
  getLatestUsers,
  getTotalMilestones,
  getCompletedMilestones,
  getAverageMilestonesPerProject,
  getAverageTasksPerMilestone,
  getMilestonesCompletionData,
  getMilestonesDeadlinesMissedRate,
  getMilestonesFeatureUtilizationRate,
  getTotalProjects,
  getNewProjects,
  getLatestProjects,
  getActiveProjects,
  getTotalTasks,
  getPendingTasks,
  getCompletedTasks,
  getTasksCompletionData,
  getTasksFeatureUtilizationRate,
} from '../actions/actions';

export class DashboardLayout extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      timePeriodOption: 1,
      maxEntries: 10
    }
    this.loadContent = this.loadContent.bind(this);
    this.changeTimePeriodOption = this.changeTimePeriodOption.bind(this);
    this.changeMaxEntriesOption = this.changeMaxEntriesOption.bind(this);
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    let startDate = moment().subtract(7,'d').format('YYYY/MM/DD');
    let endDate = moment().format('YYYY/MM/DD');
    let maxEntries = 10;
    this.getData(startDate, endDate, maxEntries);
  }

  getData(startDate, endDate, maxEntries) {
    // console.log(startDate, endDate, maxEntries);
    let jwtToken = this.props.auth.jwtToken;
    console.log(jwtToken);
    this.props.getTotalUsers(jwtToken, startDate, endDate);
    this.props.getNewUsers(startDate, endDate);
    this.props.getActiveUsers(startDate, endDate);
    this.props.getInactiveUsers(startDate, endDate);
    this.props.getRetentionRate(startDate, endDate);
    this.props.getLatestUsers(maxEntries);

    this.props.getTotalMilestones(startDate, endDate);
    this.props.getCompletedMilestones(startDate, endDate);
    this.props.getAverageMilestonesPerProject(startDate, endDate);
    this.props.getAverageTasksPerMilestone(startDate, endDate);
    this.props.getMilestonesCompletionData(startDate, endDate);
    this.props.getMilestonesDeadlinesMissedRate(startDate, endDate);
    this.props.getMilestonesFeatureUtilizationRate(startDate, endDate);

    this.props.getTotalProjects(startDate, endDate);
    this.props.getNewProjects(startDate, endDate);
    this.props.getLatestProjects(maxEntries);
    this.props.getActiveProjects(startDate, endDate);

    this.props.getTotalTasks(startDate, endDate);
    this.props.getPendingTasks(startDate, endDate);
    this.props.getCompletedTasks(startDate, endDate);
    this.props.getTasksCompletionData(startDate, endDate);
    this.props.getTasksFeatureUtilizationRate(startDate, endDate);
  }

  changeTimePeriodOption(event, index, value){
    let startDate = moment().subtract(7,'d').format('YYYY/MM/DD');
    let endDate = moment().format('YYYY/MM/DD');
    let maxEntries = 10;

    this.setState({
      timePeriodOption: value
    });

    if (value == 1) {
      startDate = moment().subtract(7,'d').format('YYYY/MM/DD');
      endDate = moment().format('YYYY/MM/DD');
    }
    if (value == 2) {
      startDate = moment().subtract(14,'d').format('YYYY/MM/DD');
      endDate = moment().format('YYYY/MM/DD');
    }
    if (value == 3) {
      startDate = moment().subtract(30,'d').format('YYYY/MM/DD');
      endDate = moment().format('YYYY/MM/DD');
    }

    maxEntries = this.state.maxEntries;

    this.getData(startDate, endDate, maxEntries);
  }

  changeMaxEntriesOption(event, index, value){
    let startDate = moment().subtract(7,'d').format('YYYY/MM/DD');
    let endDate = moment().format('YYYY/MM/DD');
    let maxEntries = 10;

    this.setState({
      maxEntries: value
    });

    maxEntries = value;

    if (this.state.timePeriodOption == 1) {
      startDate = moment().subtract(7,'d').format('YYYY/MM/DD');
      endDate = moment().format('YYYY/MM/DD');
    }
    if (this.state.timePeriodOption == 2) {
      startDate = moment().subtract(14,'d').format('YYYY/MM/DD');
      endDate = moment().format('YYYY/MM/DD');
    }
    if (this.state.timePeriodOption == 3) {
      startDate = moment().subtract(30,'d').format('YYYY/MM/DD');
      endDate = moment().format('YYYY/MM/DD');
    }

    this.getData(startDate, endDate, maxEntries);
  }

  loadContent() {
    let contentType = this.props.navigation.contentType;
    switch (contentType) {
      case "Home":
        return (
          <HomePage />
        );
      case "Projects":
        return (
          <ProjectsPage />
        );
      case "Github":
        return (
          <GithubPage />
        );
      case "Google Drive":
        return (
          <GoogleDrivePage />
        );
      case "Users":
        return (
          <UsersPage />
        );
      case "Milestones":
        return (
          <MilestonesPage />
        );
      case "Tasks":
        return (
          <TasksPage />
        );
      default:
        return (
          <HomePage />
        );
    }
  }

  render() {
    let contentType = (this.props.navigation.contentType == 'Home' ? "Collab At A Glance" : this.props.navigation.contentType);
    let dbMaxRows = 999;

    return (
      <Content>
        <HeadingContainer>
          <Heading>
            {contentType}
          </Heading>
          <Heading>
            <SelectField
              value={this.state.maxEntries}
              onChange={this.changeMaxEntriesOption}
            >
              <MenuItem value={10} primaryText="Max 10 Entries (Tables)" />
              <MenuItem value={20} primaryText="Max 20 Entries (Tables)" />
              <MenuItem value={30} primaryText="Max 30 Entries (Tables)" />
              <MenuItem value={dbMaxRows} primaryText="All Entries (Tables)" />
            </SelectField>
            <SelectField
              value={this.state.timePeriodOption}
              onChange={this.changeTimePeriodOption}
            >
              <MenuItem value={1} primaryText="Last 7 Days" />
              <MenuItem value={2} primaryText="Last 14 Days" />
              <MenuItem value={3} primaryText="Last 30 Days" />
            </SelectField>
          </Heading>
        </HeadingContainer>
        {this.loadContent()}
      </Content>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  navigation: state.navigation,
  auth: state.auth
});

const mapDispatchToProps = {
  getTotalUsers,
  getNewUsers,
  getActiveUsers,
  getInactiveUsers,
  getRetentionRate,
  getLatestUsers,
  getTotalMilestones,
  getCompletedMilestones,
  getAverageMilestonesPerProject,
  getAverageTasksPerMilestone,
  getMilestonesCompletionData,
  getMilestonesDeadlinesMissedRate,
  getMilestonesFeatureUtilizationRate,
  getTotalProjects,
  getNewProjects,
  getLatestProjects,
  getActiveProjects,
  getTotalTasks,
  getPendingTasks,
  getCompletedTasks,
  getTasksCompletionData,
  getTasksFeatureUtilizationRate
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardLayout);
