import React, { Component } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import Homepage from '../HomepageComponents/Homepage';
import PlayerArea from '../PlayerComponents/PlayerArea';
import history from '../history';

export default class Routes extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path='/' exact component={Homepage}></Route>
          <Route path='/player' component={PlayerArea}></Route>
        </Switch>
      </Router>
    );
  }
}
