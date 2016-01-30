'use babel';

import React from 'react';
import ReactDOM from 'react-dom';
import Tooltip from 'rc-tooltip';
import { Router, Route, Link, IndexRedirect } from 'react-router';
import { IntlProvider } from 'react-intl';
import humane from 'humane-js';

import Info from './info';
import Settings from './settings/settings';
import Containers from './containers/containers';
import CreateContainer from './containers/create/create';
import ConsoleContainer from './containers/console/console';
import LogsContainer from './containers/logs/logs';
import Images from './images/images';
import docker from './lib/docker';

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


class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      info: {}
    };
  }

  getInfo = () => {
    docker.info()
      .then(info => this.setState({ info: info }))
      .catch(err => { /* Try again until it works. - Einstein */ })
      .finally(() => this.infoTimer = setTimeout(this.getInfo, 450));
  };

  getVersion = () => {
    docker.version()
      .then(version => this.setState({ version: version }));
  };

  componentWillMount() {
    this.getInfo();
    this.getVersion();
  }

  componentWillUnmount() {
    clearTimeout(this.infoTimer);
  }

  render() {
    const isActive = this.props.history.isActive;
    const links = [ 'containers', 'images' ];
    return (
      <div>
        <nav className="navbar navbar-default navbar-static-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand">
                <img alt="Docker" src="assets/images/docker.png" />
              </a>
            </div>
            <ul className="nav navbar-nav navbar-left">
              { links.map(link => (
                <li key={link} className={ isActive(`/${link}`) ? 'active' : 'inactive' }>
                  <Link to={`/${link}`}>{ link }</Link>
                </li>
              )) }
            </ul>

            <ul className="nav navbar-nav navbar-right">
              <li>
                <Tooltip
                  placement="bottomRight"
                  mouseLeaveDelay={0.5}
                  align={{ offset: [ 42, 0 ] }}
                  overlay={<Info data={this.state.info} version={this.state.version} />}>
                  <i className="no-link fa fa-info fa-lg"></i>
                </Tooltip>
              </li>
              <li><Link to={'/settings'}><i className="fa fa-cog fa-lg fa-spin-hover"></i></Link></li>
            </ul>
          </div>
        </nav>
        { this.props.children }
      </div>
    );
  }
}

ReactDOM.render((
    <IntlProvider locale="en">
      <Router>
        <Route path="/" component={Main} >
          <IndexRedirect to="/containers" />
          <Route path="settings" component={Settings} />
          <Route path="containers" component={Containers} />
          <Route path="containers/create/:imageId" component={CreateContainer} />
          <Route path="containers/console/:containerId" component={ConsoleContainer} />
          <Route path="containers/logs/:id" component={LogsContainer} />
          <Route path="images" component={Images} />
        </Route>
      </Router>
    </IntlProvider>
), document.getElementById('content'));
