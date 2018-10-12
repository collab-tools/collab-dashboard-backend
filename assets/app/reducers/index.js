import { combineReducers } from 'redux';
import navigation from './navigation';
import auth from './auth';
import projects from './projects';
import users from './users';
import milestones from './milestones';
import tasks from './tasks';
import staffs from './staffs';

const rootReducer = combineReducers({
  navigation,
  auth,
  projects,
  users,
  milestones,
  tasks,
  staffs,
})

export default rootReducer;
