'use babel';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link } from 'react-router';
import Containers from './containers';
import Logs from './logs';
import humane from 'humane-js';

humane.error = humane.spawn({
  addnCls: 'humane-jackedup-error',
  timeout: 10000,
  timeoutAfterMove: 0,
  clickToClose: true
});

const Main = React.createClass({
  render() {
    return (
      <div>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-header navbar-brand">
              <img alt="Docker" src="images/docker.png" />
            </div>
            <ul className="nav navbar-nav">
              <li className="active">
                <Link to="/containers">Containers</Link>
              </li>
            </ul>
          </div>
        </nav>
        { this.props.children }
      </div>
    );
  }
});

ReactDOM.render((
  <Router>
    <Route path="/" component={Main}>
      <Route path="containers" component={Containers} />
      <Route path="logs/:id" component={Logs} />
    </Route>
  </Router>
), document.getElementById('content'));
