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

import {
  getMilestonesByProjectId
} from '../actions/actions';

import Content from '../components/Content';
import Section from '../components/Section';
import MetricsRow from '../components/MetricsRow'
import Subheading from '../components/Subheading';
import Card from '../components/Card';

export class ProjectsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldRenderMilestonesByProjectId: false,
      rowNumber: 0,
    };
    this.projectsTableCellClicked = this.projectsTableCellClicked.bind(this);
  }

  projectsTableCellClicked(row, column, event){
    let projects = this.props.projects;
    let latestProjects = projects.latestProjects;
    let projectId = latestProjects[row].project_id;
    this.props.getMilestonesByProjectId(projectId)
    this.setState({
      shouldRenderMilestonesByProjectId: true,
      rowNumber: row
    });
  }

  _renderMilestonesByProjectId() {
    let projects = this.props.projects;
    let latestProjects = projects.latestProjects;
    let projectName = latestProjects[this.state.rowNumber].content;
    let milestoneNamesByProjectId = projects.milestoneNamesByProjectId;
    let completedTasksInMilestonesByProjectId = projects.completedTasksInMilestonesByProjectId;
    let incompleteTasksInMilestonesByProjectId = projects.incompleteTasksInMilestonesByProjectId;
    let milestoneNamesByProjectIdGraphConfig = {
      chart: {
        type: 'bar'
      },
      title: {
          text: 'Milestones'
      },
      xAxis: {
          categories: milestoneNamesByProjectId
      },
      yAxis: {
          min: 0,
          title: {
              text: 'Completed Tasks'
          }
      },
      legend: {
          reversed: true
      },
      plotOptions: {
          series: {
              stacking: 'normal'
          }
      },
      series: [{
          name: 'Completed Tasks',
          data: completedTasksInMilestonesByProjectId
      }, {
          name: 'Incomplete Tasks',
          data: incompleteTasksInMilestonesByProjectId
      }]
    };
    if (this.state.shouldRenderMilestonesByProjectId) {
      return (
        <div>
          <Section>
            <Subheading>Milestone Statistics by {projectName}</Subheading>
            <Card>
              <ReactHighcharts config={milestoneNamesByProjectIdGraphConfig}></ReactHighcharts>
            </Card>
          </Section>
        </div>
      );
    }
  }

  render() {
    let projects = this.props.projects;
    let latestProjects = projects.latestProjects;
    let milestonesByProjectId = projects.milestonesByProjectId;
    let activeProjectsRate = (projects.activeProjects * 100).toFixed(1) + "%";
    let metricsData = [{
      metric: projects.newProjects,
      metricLabel: "New Projects",
    }, {
      metric: projects.averageProjectSize,
      metricLabel: "Average Project Size",
    }, {
      metric: activeProjectsRate,
      metricLabel: "Active Projects",
    }];
    // console.log('ProjectsPage - milestonesByProjectId', milestonesByProjectId);
    return (
      <Content id="projectsPage">
        <Section>
          <MetricsRow metricsData={metricsData} />
        </Section>
        {
          latestProjects.length < 1 ?
          <Section>
            <Subheading>No Projects Found!</Subheading>
          </Section>
          :
          <div>
            <Section>
              <Subheading>Projects</Subheading>
              <Card>
                <Table onCellClick={this.projectsTableCellClicked}>
                  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                      <TableHeaderColumn>Name</TableHeaderColumn>
                      <TableHeaderColumn>Repository</TableHeaderColumn>
                      <TableHeaderColumn>Members</TableHeaderColumn>
                      <TableHeaderColumn>Size</TableHeaderColumn>
                      <TableHeaderColumn>Created Date</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody displayRowCheckbox={false}>
                    {latestProjects.map((row, index) => (
                      <TableRow key={index}>
                        <TableRowColumn>{row.content}</TableRowColumn>
                        <TableRowColumn>{row.github_repo_name}</TableRowColumn>
                        <TableRowColumn>{row.members}</TableRowColumn>
                        <TableRowColumn>{row.project_size}</TableRowColumn>
                        <TableRowColumn>{row.created_at}</TableRowColumn>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </Section>
            {this._renderMilestonesByProjectId()}
          </div>
        }
      </Content>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  projects: state.projects,
});

const mapDispatchToProps = {
  getMilestonesByProjectId,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectsPage);
