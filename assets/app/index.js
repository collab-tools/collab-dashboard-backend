import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { HashRouter as Router, Route, Link, Switch } from 'react-router-dom';

import configureStore from './store/configStore'

import LoginPage from './containers/LoginPage';
import DashboardPage from './containers/DashboardPage';
import _404 from './components/_404';

const { persistor, store } = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <Switch>
          <Route exact path="/" component={ LoginPage } />
          <Route path="/dashboard" component={ DashboardPage } />
          <Route component={ _404 } />
        </Switch>
      </Router>
    </PersistGate>
  </Provider>,
  document.getElementById('application')
)
