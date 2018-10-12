import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactHighcharts from 'react-highcharts';

import Content from '../components/Content';
import Section from '../components/Section';
import MetricsRow from '../components/MetricsRow';
import Subheading from '../components/Subheading';
import Card from '../components/Card';

export class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let users = this.props.users;
    let milestones = this.props.milestones;
    let tasks = this.props.tasks;
    let retentionRate = (users.retentionRate * 100).toFixed(1) + "%";
    let milestonesFeatureUtilizationRate = (milestones.featureUtilizationRate).toFixed(1) * 100;
    let tasksFeatureUtilizationRate = (tasks.featureUtilizationRate).toFixed(1) * 100;
    let metricsData_1 = [{
      metric: users.newUsers,
      metricLabel: "New Users",
    }, {
      metric: milestones.totalMilestones,
      metricLabel: "Total Milestones",
    }, {
      metric: retentionRate,
      metricLabel: "Retention Rate",
    }];
    let metricsData_2 = [{
      metric: users.activeUsers,
      metricLabel: "Active Users",
    }, {
      metric: users.inactiveUsers,
      metricLabel: "Inactive Users",
    }];
    let featureUtilizationGraphConfig = {
      chart: {
        type: 'bar',
        style: {
          fontFamily: "'Roboto', sans-serif",
          fontWeight: 'bold'
        }
      },
      title: {
          text: 'Feature Utilization Rate'
      },
      yAxis: {
        title: {
          text: 'Features'
        }
      },
      xAxis: {
        categories: ['Milestones', 'Tasks']
      },
      series: [{
        name: 'Feature Utilization Rate (%)',
        data: [milestonesFeatureUtilizationRate, tasksFeatureUtilizationRate]
      }]
    };
    return (
      <Content id="homePage">
        <Section>
          <MetricsRow metricsData={metricsData_1} />
        </Section>
        <Section>
          <MetricsRow metricsData={metricsData_2} />
        </Section>
        <Section>
          <Subheading>Feature Utilization Rate</Subheading>
          <Card>
            <ReactHighcharts config={featureUtilizationGraphConfig}></ReactHighcharts>
          </Card>
        </Section>
      </Content>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  users: state.users,
  milestones: state.milestones,
  tasks: state.tasks,
});

export default connect(
  mapStateToProps,
  null
)(HomePage);
