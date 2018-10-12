import {
  GET_TOTAL_PROJECTS,
  GET_NEW_PROJECTS,
  GET_LATEST_PROJECTS,
  GET_ACTIVE_PROJECTS,
  GET_MILESTONES_BY_PROJECT_ID
} from '../constants/actionTypes';

import moment from 'moment';

const initialState = {
  totalProjects: -1,
  newProjects: -1,
  latestProjects: null,
  activeProjects: -1,
  milestonesByProjectId: null,
  milestoneNamesByProjectId: null,
  completedTasksInMilestonesByProjectId: null,
  incompleteTasksInMilestonesByProjectId: null
}


export default function projects(state = initialState, action) {
  switch (action.type) {
    case GET_TOTAL_PROJECTS:
      return Object.assign({}, state, {
        totalProjects: action.totalProjects,
      });
    case GET_NEW_PROJECTS:
      return Object.assign({}, state, {
        newProjects: action.newProjects,
      });
    case GET_LATEST_PROJECTS: {
      let _latestProjects = action.latestProjects;
      let projectMembers = [];
      let sumProjectMemberSize = 0;
      let averageProjectSize = 0;
      for (var i = 0; i < _latestProjects.length; i++) {
        for (var key in _latestProjects[i]) {
          if (_latestProjects[i].hasOwnProperty(key) && _latestProjects[i][key] == null) {
            _latestProjects[i][key] = 'N.A';
          }
          if (key == 'created_at') {
            _latestProjects[i][key] = moment(_latestProjects[i][key]).format("DD MMM YYYY");
          }
          if (key == 'members') {
            projectMembers = _latestProjects[i][key].split(',');
            _latestProjects[i][key] = _latestProjects[i][key].replace(",", ", ");
          }
        }
        _latestProjects[i]["project_size"] = projectMembers.length;
        sumProjectMemberSize += projectMembers.length;
      }
      averageProjectSize = (sumProjectMemberSize / _latestProjects.length).toFixed(1);
      return Object.assign({}, state, {
        latestProjects: _latestProjects,
        averageProjectSize: averageProjectSize,
      });
    }
    case GET_ACTIVE_PROJECTS:
      return Object.assign({}, state, {
        activeProjects: action.activeProjects,
      });
    case GET_MILESTONES_BY_PROJECT_ID: {
      let _milestonesByProjectId = action.milestonesByProjectId;
      let _milestoneNamesByProjectId = [];
      let _completedTasksInMilestonesByProjectId = [];
      let _incompleteTasksInMilestonesByProjectId = [];

      // console.log('_milestonesByProjectId', _milestonesByProjectId);

      for (var milestoneIdKey in _milestonesByProjectId) {
        for (var key in _milestonesByProjectId[milestoneIdKey]) {
          if (key == 'milestone_name') {
            _milestoneNamesByProjectId.push(_milestonesByProjectId[milestoneIdKey][key]);
          }
          if (key == 'num_tasks_completed') {
            _completedTasksInMilestonesByProjectId.push(parseInt(_milestonesByProjectId[milestoneIdKey][key]));
          }
          if (key == 'num_tasks_incomplete') {
            _incompleteTasksInMilestonesByProjectId.push(parseInt(_milestonesByProjectId[milestoneIdKey][key]));
          }
        }
      }

      // console.log('_completedTasksInMilestonesByProjectId', _completedTasksInMilestonesByProjectId);
      // console.log('_incompleteTasksInMilestonesByProjectId', _incompleteTasksInMilestonesByProjectId);

      return Object.assign({}, state, {
        milestonesByProjectId: action.milestonesByProjectId,
        milestoneNamesByProjectId: _milestoneNamesByProjectId,
        completedTasksInMilestonesByProjectId: _completedTasksInMilestonesByProjectId,
        incompleteTasksInMilestonesByProjectId: _incompleteTasksInMilestonesByProjectId
      });
    }
    default:
      return state;
  }
}
