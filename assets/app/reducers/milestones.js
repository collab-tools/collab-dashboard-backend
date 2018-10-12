import {
  GET_TOTAL_MILESTONES,
  GET_COMPLETED_MILESTONES,
  GET_AVERAGE_MILESTONES_PER_PROJECT,
  GET_AVERAGE_TASKS_PER_MILESTONE,
  GET_MILESTONES_COMPLETION_DATA,
  GET_MILESTONES_DEADLINES_MISSED_RATE,
  GET_MILESTONES_FEATURE_UTILIZATION_RATE,
} from '../constants/actionTypes';

import stats from 'stats-lite';

const initialState = {
  totalMilestones: -1,
  completedMilestones: -1,
  milestoneCompletionTimesInSeconds: null,
  milestoneCompletionTimesInHours: null,
  milestoneCompletionTimesInDays: null,
  averageCompletionTimeInSeconds: -1,
  averageCompletionTimeInHours: -1,
  averageCompletionTimeInDays: -1,
  totalCompletionTimeInSeconds: -1,
  totalCompletionTimeInHours: -1,
  totalCompletionTimeInDays: -1,
  standardDeviationCompletionTimeInSeconds: -1,
  standardDeviationCompletionTimeInHours: -1,
  standardDeviationCompletionTimeInDays: -1,
  averageMilestonesPerProject: -1,
  averageTasksPerMilestone: -1,
  deadlinesMissedRate: -1,
  featureUtilizationRate: -1,
}


export default function milestones(state = initialState, action) {
  switch (action.type) {
    case GET_TOTAL_MILESTONES:
      return Object.assign({}, state, {
        totalMilestones: action.totalMilestones,
      });
    case GET_COMPLETED_MILESTONES:
      return Object.assign({}, state, {
        completedMilestones: action.completedMilestones,
      });
    case GET_AVERAGE_MILESTONES_PER_PROJECT:
      return Object.assign({}, state, {
        averageMilestonesPerProject: action.averageMilestonesPerProject,
      });
    case GET_AVERAGE_TASKS_PER_MILESTONE:
      return Object.assign({}, state, {
        averageTasksPerMilestone: action.averageTasksPerMilestone,
      });
    case GET_MILESTONES_COMPLETION_DATA: {
      let _milestonesCompletionData = action.milestonesCompletionData;
      let _averageCompletionTimeInSeconds = 0;
      let _averageCompletionTimeInHours = 0;
      let _averageCompletionTimeInDays = 0;
      let _totalCompletionTimeInSeconds = 0;
      let _totalCompletionTimeInHours = 0;
      let _totalCompletionTimeInDays = 0;
      let _milestoneCompletionTimesInSeconds = [];
      let _milestoneCompletionTimesInHours = [];
      let _milestoneCompletionTimesInDays = [];
      let _standardDeviationCompletionTimeInSeconds = 0;
      let _standardDeviationCompletionTimeInHours = 0;
      let _standardDeviationCompletionTimeInDays = 0;

      for (var i = 0; i < _milestonesCompletionData.length; i++) {
        for (var key in _milestonesCompletionData[i]) {
          if (_milestonesCompletionData[i].hasOwnProperty(key) && _milestonesCompletionData[i][key] == null) {
            _milestonesCompletionData[i][key] = 'N.A';
          }
          if (key == 'time_taken') {
            _milestoneCompletionTimesInSeconds.push(_milestonesCompletionData[i][key]);
            _milestoneCompletionTimesInHours.push(((_milestonesCompletionData[i][key]) / 60) / 60);
            _milestoneCompletionTimesInDays.push((((_milestonesCompletionData[i][key]) / 60) / 60) / 24);
            _totalCompletionTimeInSeconds += parseInt(_milestonesCompletionData[i][key]);
            // console.log('_totalCompletionTimeInSeconds', _totalCompletionTimeInSeconds);
          }
        }
      }
      if (_totalCompletionTimeInSeconds != 0) {
        _totalCompletionTimeInHours = (_totalCompletionTimeInSeconds / 60) / 60;
        _totalCompletionTimeInDays = _totalCompletionTimeInHours / 24;
        _averageCompletionTimeInSeconds = _totalCompletionTimeInSeconds / _milestonesCompletionData.length;
        _averageCompletionTimeInHours = (_averageCompletionTimeInSeconds / 60) / 60;
        _averageCompletionTimeInDays = _averageCompletionTimeInHours / 24;
        _standardDeviationCompletionTimeInSeconds = stats.stdev(_milestoneCompletionTimesInSeconds);
        _standardDeviationCompletionTimeInHours = stats.stdev(_milestoneCompletionTimesInHours);
        _standardDeviationCompletionTimeInDays = stats.stdev(_milestoneCompletionTimesInDays);
      }
      // console.log('_milestoneCompletionTimesInSeconds', _milestoneCompletionTimesInSeconds);
      // console.log('_milestoneCompletionTimesInHours', _milestoneCompletionTimesInHours);
      // console.log('_milestoneCompletionTimesInDays', _milestoneCompletionTimesInDays);
      // console.log('_totalCompletionTimeInSeconds', _totalCompletionTimeInSeconds);
      // console.log('_totalCompletionTimeInHours', _totalCompletionTimeInHours);
      // console.log('_totalCompletionTimeInDays', _totalCompletionTimeInDays);
      // console.log('_averageCompletionTimeInSeconds', _averageCompletionTimeInSeconds);
      // console.log('_averageCompletionTimeInDays', _averageCompletionTimeInDays);
      // console.log('_standardDeviationCompletionTimeInSeconds', _standardDeviationCompletionTimeInSeconds);
      // console.log('_standardDeviationCompletionTimeInHours', _standardDeviationCompletionTimeInHours);
      // console.log('_standardDeviationCompletionTimeInDays', _standardDeviationCompletionTimeInDays);

      return Object.assign({}, state, {
        milestoneCompletionTimesInSeconds: _milestoneCompletionTimesInSeconds,
        milestoneCompletionTimesInHours: _milestoneCompletionTimesInHours,
        milestoneCompletionTimesInDays: _milestoneCompletionTimesInDays,
        averageCompletionTimeInSeconds: _averageCompletionTimeInSeconds,
        averageCompletionTimeInHours: _averageCompletionTimeInHours,
        averageCompletionTimeInDays: _averageCompletionTimeInDays,
        totalCompletionTimeInSeconds: _totalCompletionTimeInSeconds,
        totalCompletionTimeInHours: _totalCompletionTimeInHours,
        totalCompletionTimeInDays: _totalCompletionTimeInDays,
        standardDeviationCompletionTimeInSeconds: _standardDeviationCompletionTimeInSeconds,
        standardDeviationCompletionTimeInHours: _standardDeviationCompletionTimeInHours,
        standardDeviationCompletionTimeInDays: _standardDeviationCompletionTimeInDays,
      });
    }
    case GET_MILESTONES_DEADLINES_MISSED_RATE:
      return Object.assign({}, state, {
        deadlinesMissedRate: action.deadlinesMissedRate,
      });
    case GET_MILESTONES_FEATURE_UTILIZATION_RATE:
      return Object.assign({}, state, {
        featureUtilizationRate: action.featureUtilizationRate,
      });
    default:
      return state;
  }
}
