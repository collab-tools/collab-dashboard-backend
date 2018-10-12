import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Content from '../components/Content';
import Section from '../components/Section';
import MetricsRow from '../components/MetricsRow';

export class MilestonesPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let milestones = this.props.milestones;
    let deadlinesMissedRate = (milestones.deadlinesMissedRate * 100).toFixed(1) + "%";
    let averageMilestonesPerProject = (milestones.averageMilestonesPerProject).toFixed(1);
    let averageTasksPerMilestone = (milestones.averageTasksPerMilestone).toFixed(1);
    let totalCompletionTimeInSeconds = (milestones.totalCompletionTimeInSeconds).toFixed(1);
    let totalCompletionTimeInHours = (milestones.totalCompletionTimeInHours).toFixed(1);
    let totalCompletionTimeInDays = (milestones.totalCompletionTimeInDays).toFixed(1);
    let averageCompletionTimeInSeconds = (milestones.averageCompletionTimeInSeconds).toFixed(1);
    let averageCompletionTimeInHours = (milestones.averageCompletionTimeInHours).toFixed(1);
    let averageCompletionTimeInDays = (milestones.averageCompletionTimeInDays).toFixed(1);
    let standardDeviationCompletionTimeInSeconds= (milestones.standardDeviationCompletionTimeInSeconds).toFixed(1);
    let standardDeviationCompletionTimeInHours = (milestones.standardDeviationCompletionTimeInHours).toFixed(1);
    let standardDeviationCompletionTimeInDays = (milestones.standardDeviationCompletionTimeInDays).toFixed(1);
    let featureUtilizationRate = (milestones.featureUtilizationRate * 100).toFixed(1) + "%";

    let totalCompletionTime = totalCompletionTimeInSeconds + 's';
    let averageCompletionTime = averageCompletionTimeInSeconds + 's';
    let standardDeviationCompletionTime = standardDeviationCompletionTimeInSeconds + 's';

    // console.log('totalCompletionTime', totalCompletionTime);
    // console.log('averageCompletionTime', averageCompletionTime);
    // console.log('standardDeviationCompletionTime', standardDeviationCompletionTime);

    if (totalCompletionTimeInSeconds > 3600) {
      totalCompletionTime = totalCompletionTimeInHours + ' hrs';
      if (totalCompletionTimeInHours > 24) {
        totalCompletionTime = totalCompletionTimeInDays + ' days';
      }
    }
    if (averageCompletionTimeInSeconds > 3600) {
      averageCompletionTime = averageCompletionTimeInHours + ' hrs';
      if (averageCompletionTimeInHours > 24) {
        averageCompletionTime = averageCompletionTimeInDays + ' days';
      }
    }
    if (standardDeviationCompletionTimeInSeconds > 3600) {
      standardDeviationCompletionTime = standardDeviationCompletionTimeInHours + ' hrs';
      if (standardDeviationCompletionTimeInHours > 24) {
        standardDeviationCompletionTime = standardDeviationCompletionTimeInDays + ' days';
      }
    }

    let metricsData_1 = [{
      metric: milestones.totalMilestones,
      metricLabel: "Total Milestones",
    }, {
      metric: milestones.completedMilestones,
      metricLabel: "Completed Milestones",
    }, {
      metric: deadlinesMissedRate,
      metricLabel: "Deadlines Missed",
    }];
    let metricsData_2 = [{
      metric: averageMilestonesPerProject,
      metricLabel: "Average Milestones Per Project",
    }, {
      metric: averageTasksPerMilestone,
      metricLabel: "Average Tasks Per Milestone",
    }, {
      metric: featureUtilizationRate,
      metricLabel: "Feature Utilization Rate",
    }];
    let metricsData_3 = [{
      metric: totalCompletionTime,
      metricLabel: "Total Completion Time",
    }, {
      metric: averageCompletionTime,
      metricLabel: "Average Completion Time",
    }, {
      metric: standardDeviationCompletionTime,
      metricLabel: "Standard Deviation - Completion Time",
    }];
    return (
      <Content id="milestonesPage">
        <Section>
          <MetricsRow metricsData={metricsData_1} />
        </Section>
        <Section>
          <MetricsRow metricsData={metricsData_2} />
        </Section>
        <Section>
          <MetricsRow metricsData={metricsData_3} />
        </Section>
      </Content>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  milestones: state.milestones,
});

export default connect(
  mapStateToProps,
  null
)(MilestonesPage);
