import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactHighcharts from 'react-highcharts';

import Content from '../components/Content';
import Section from '../components/Section';
import MetricsRow from '../components/MetricsRow';
import Subheading from '../components/Subheading';
import Card from '../components/Card';

export class GoogleDrivePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let metricsData_1 = [{
      metric: '3',
      metricLabel: "New Files Shared",
    }, {
      metric: '5',
      metricLabel: "Changes Made",
    }];
    let metricsData_2 = [{
      metric: '30%',
      metricLabel: "Feature Utilization Rate",
    }, {
      metric: '5',
      metricLabel: "Standard Deviation - New Files",
    }, {
      metric: '15',
      metricLabel: "Active Teams",
    }];
    let fileTypesSharedGraphConfig = {
      chart: {
        type: 'bar',
        style: {
          fontFamily: "'Roboto', sans-serif",
          fontWeight: 'bold'
        }
      },
      title: {
          text: 'File Types Shared'
      },
      yAxis: {
        title: {
          text: 'Files Shared'
        }
      },
      xAxis: {
        categories: ['.docx', '.jpg', '.png', '.pdf']
      },
      series: [{
        name: 'No. of Files Shared',
        data: [4, 12, 3, 1]
      }]
    };
    return (
      <Content id="drivePage">
        <Section>
          <MetricsRow metricsData={metricsData_1} />
        </Section>
        <Section>
          <MetricsRow metricsData={metricsData_2} />
        </Section>
        <Section>
          <Subheading>File Types Shared</Subheading>
          <Card>
            <ReactHighcharts config={fileTypesSharedGraphConfig}></ReactHighcharts>
          </Card>
        </Section>
      </Content>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
});

export default connect(
  mapStateToProps,
  null
)(GoogleDrivePage);
