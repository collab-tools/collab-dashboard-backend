import {
  GET_TOTAL_TASKS,
  GET_PENDING_TASKS,
  GET_COMPLETED_TASKS,
  GET_TASKS_COMPLETION_DATA,
  GET_TASKS_FEATURE_UTILIZATION_RATE,
} from '../constants/actionTypes';

import stats from 'stats-lite';

const initialState = {
  totalTasks: -1,
  pendingTasks: -1,
  completedTasks: -1,
  taskCompletionTimesInSeconds: null,
  taskCompletionTimesInHours: null,
  taskCompletionTimesInDays: null,
  averageCompletionTimeInSeconds: -1,
  averageCompletionTimeInHours: -1,
  averageCompletionTimeInDay: -1,
  totalCompletionTimeInSeconds: -1,
  totalCompletionTimeInHours: -1,
  totalCompletionTimeInDays: -1,
  standardDeviationCompletionTimeInSeconds: -1,
  standardDeviationCompletionTimeInHours: -1,
  standardDeviationCompletionTimeInDays: -1,
  featureUtilizationRate: -1,
}

export default function tasks(state = initialState, action) {
  switch (action.type) {
    case GET_TOTAL_TASKS:
      return Object.assign({}, state, {
        totalTasks: action.totalTasks,
      });
    case GET_PENDING_TASKS:
      return Object.assign({}, state, {
        pendingTasks: action.pendingTasks,
      });
    case GET_COMPLETED_TASKS:
      return Object.assign({}, state, {
        completedTasks: action.completedTasks,
      });
    case GET_TASKS_COMPLETION_DATA: {
      let _tasksCompletionData = action.tasksCompletionData;
      let _averageCompletionTimeInSeconds = 0;
      let _averageCompletionTimeInHours = 0;
      let _averageCompletionTimeInDays = 0;
      let _totalCompletionTimeInSeconds = 0;
      let _totalCompletionTimeInHours = 0;
      let _totalCompletionTimeInDays = 0;
      let _taskCompletionTimesInSeconds = [];
      let _taskCompletionTimesInHours = [];
      let _taskCompletionTimesInDays = [];
      let _standardDeviationCompletionTimeInSeconds = 0;
      let _standardDeviationCompletionTimeInHours = 0;
      let _standardDeviationCompletionTimeInDays = 0;

      for (var i = 0; i < _tasksCompletionData.length; i++) {
        for (var key in _tasksCompletionData[i]) {
          if (_tasksCompletionData[i].hasOwnProperty(key) && _tasksCompletionData[i][key] == null) {
            _tasksCompletionData[i][key] = 'N.A';
          }
          if (key == 'time_taken') {
            _taskCompletionTimesInSeconds.push(_tasksCompletionData[i][key]);
            _taskCompletionTimesInHours.push(((_tasksCompletionData[i][key]) / 60) / 60);
            _taskCompletionTimesInDays.push((((_tasksCompletionData[i][key]) / 60) / 60) / 24);
            _totalCompletionTimeInSeconds += parseInt(_tasksCompletionData[i][key]);
            // console.log('_totalCompletionTimeInSeconds', _totalCompletionTimeInSeconds);
          }
        }
      }
      if (_totalCompletionTimeInSeconds != 0) {
        _totalCompletionTimeInHours = (_totalCompletionTimeInSeconds / 60) / 60;
        _totalCompletionTimeInDays = _totalCompletionTimeInHours / 24;
        _averageCompletionTimeInSeconds = _totalCompletionTimeInSeconds / _tasksCompletionData.length;
        _averageCompletionTimeInHours = (_averageCompletionTimeInSeconds / 60) / 60;
        _averageCompletionTimeInDays = _averageCompletionTimeInHours / 24;
        _standardDeviationCompletionTimeInSeconds = stats.stdev(_taskCompletionTimesInSeconds);
        _standardDeviationCompletionTimeInHours = stats.stdev(_taskCompletionTimesInHours);
        _standardDeviationCompletionTimeInDays = stats.stdev(_taskCompletionTimesInDays);
      }
      // console.log('_taskCompletionTimesInSeconds', _taskCompletionTimesInSeconds);
      // console.log('_taskCompletionTimesInHours', _taskCompletionTimesInHours);
      // console.log('_taskCompletionTimesInDays', _taskCompletionTimesInDays);
      // console.log('_totalCompletionTimeInSeconds', _totalCompletionTimeInSeconds);
      // console.log('_totalCompletionTimeInHours', _totalCompletionTimeInHours);
      // console.log('_totalCompletionTimeInDays', _totalCompletionTimeInDays);
      // console.log('_averageCompletionTimeInSeconds', _averageCompletionTimeInSeconds);
      // console.log('_averageCompletionTimeInDays', _averageCompletionTimeInDays);
      // console.log('_standardDeviationCompletionTimeInSeconds', _standardDeviationCompletionTimeInSeconds);
      // console.log('_standardDeviationCompletionTimeInHours', _standardDeviationCompletionTimeInHours);
      // console.log('_standardDeviationCompletionTimeInDays', _standardDeviationCompletionTimeInDays);

      return Object.assign({}, state, {
        taskCompletionTimesInSeconds: _taskCompletionTimesInSeconds,
        taskCompletionTimesInHours: _taskCompletionTimesInHours,
        taskCompletionTimesInDays: _taskCompletionTimesInDays,
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
    case GET_TASKS_FEATURE_UTILIZATION_RATE:
      return Object.assign({}, state, {
        featureUtilizationRate: action.featureUtilizationRate,
      });
    default:
      return state;
  }
}
