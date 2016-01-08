'use babel';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRedirect } from 'react-router';
import { IntlMixin } from 'react-intl';
import humane from 'humane-js';
import intlData from './localization/intl-data.js';
import Containers from './containers/containers';
import CreateContainer from './containers/create/create';
import ConsoleContainer from './containers/console/console';
import Logs from './logs/logs';
import Images from './images/images';

humane.error = humane.spawn({
  addnCls: 'humane-jackedup-error',
  timeout: 10000,
  timeoutAfterMove: 0,
  clickToClose: true
});

humane.info = humane.spawn({
  addnCls: 'humane-jackedup-info',
  timeout: 5000,
  timeoutAfterMove: 0,
  clickToClose: true
});

humane.success = humane.spawn({
  addnCls: 'humane-jackedup-success',
  timeout: 5000,
  timeoutAfterMove: 0,
  clickToClose: true
});


const Main = React.createClass({
  mixin: [ IntlMixin ],

  render() {
    const isActive = this.props.history.isActive;
    const links = [ 'containers', 'images' ];
    return (
      <div>
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-header navbar-brand">
              <img alt="Docker" src="assets/images/docker.png" />
            </div>
            <ul className="nav navbar-nav">
              { links.map(link => (
                <li key={link} className={ isActive(`/${link}`) ? 'active' : 'inactive' }>
                  <Link to={`/${link}`}>{ link }</Link>
                </li>
              )) }
            </ul>
          </div>
        </nav>
        { this.props.children }
      </div>
    );
  }
});

function createElement(Component, props) {
  const newProps = Object.assign({}, props, props.route);
  return (<Component {...newProps} />);
}

ReactDOM.render((
  <Router createElement={createElement}>
    <Route path="/" component={Main} >
      <IndexRedirect to="/containers" />
      <Route path="containers" component={Containers} {...intlData} />
      <Route path="containers/create/:imageId" component={CreateContainer} {...intlData} />
      <Route path="containers/console/:containerId" component={ConsoleContainer} {...intlData} />
      <Route path="logs/:id" component={Logs} {...intlData} />
      <Route path="images" component={Images} {...intlData} />
    </Route>
  </Router>
), document.getElementById('content'));
