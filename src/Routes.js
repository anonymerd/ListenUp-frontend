import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";
import HomePage from "./HomePage";
import MainPlayer from "./player/MainPlayer";
import history from "./history";

export default class Routes extends Component {
    render() {
        return(
            <Router history={history}>
                <Switch>
                    <Route path='/' exact component={HomePage}></Route>
                    <Route path='/player' component={MainPlayer}></Route>
                </Switch>
            </Router>
        )
    }
}