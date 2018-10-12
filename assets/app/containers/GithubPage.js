import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactHighcharts from 'react-highcharts';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import Content from '../components/Content';
import Section from '../components/Section';
import MetricsRow from '../components/MetricsRow';
import Subheading from '../components/Subheading';
import Card from '../components/Card';

export class GithubPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let metricsData_1 = [{
      metric: '2',
      metricLabel: "New Repositories",
    }, {
      metric: '15',
      metricLabel: "Commits Pushed",
    }, {
      metric: '29',
      metricLabel: "Releases Pushed",
    }];
    let metricsData_2 = [{
      metric: '12%',
      metricLabel: "Feature Utilization Rate",
    }, {
      metric: '7',
      metricLabel: "Standard Deviation - New Commits",
    }, {
      metric: '15',
      metricLabel: "Tracked Releases",
    }];
    let commitsGraphConfig = {
      chart: {
        style: {
          fontFamily: "'Roboto', sans-serif",
          fontWeight: 'bold'
        }
      },
      title: {
          text: 'Commits (Contributions to Master Branches)'
      },
      yAxis: {
        title: {
          text: 'No. of Commits'
        }
      },
      xAxis: {
        dates: ['12 Jan', '13 Jan', '14 Jan', '15 Jan', '16 Jan']
      },
      series: [{
        name: 'No. of Files Shared',
        data: [4, 0, 3, 1, 2]
      }]
    };
    let latestRepositories = [{
      project_name: 'Project 1',
      repository_name: 'Repository136',
      release_tag: '4238942341232',
      assets: 'N.A',
      date: '14 Jan 2018'
    }, {
      project_name: 'Project 62',
      repository_name: 'Repository061',
      release_tag: '3485989023489',
      assets: 'N.A',
      date: '18 Jan 2018'
    }]
    return (
      <Content id="githubPage">
        <Section>
          <MetricsRow metricsData={metricsData_1} />
        </Section>
        <Section>
          <MetricsRow metricsData={metricsData_2} />
        </Section>
        <Section>
          <Subheading>Commits</Subheading>
          <Card>
            <ReactHighcharts config={commitsGraphConfig}></ReactHighcharts>
          </Card>
        </Section>
        <Section>
          <Subheading>Releases</Subheading>
          <Card>
            <Table>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn>Project</TableHeaderColumn>
                  <TableHeaderColumn>Repository</TableHeaderColumn>
                  <TableHeaderColumn>Release Tag</TableHeaderColumn>
                  <TableHeaderColumn>Assets</TableHeaderColumn>
                  <TableHeaderColumn>Date</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {latestRepositories.map((row, index) => (
                  <TableRow key={index}>
                    <TableRowColumn>{row.project_name}</TableRowColumn>
                    <TableRowColumn>{row.repository_name}</TableRowColumn>
                    <TableRowColumn>{row.release_tag}</TableRowColumn>
                    <TableRowColumn>{row.assets}</TableRowColumn>
                    <TableRowColumn>{row.date}</TableRowColumn>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
)(GithubPage);
