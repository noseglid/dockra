'use babel';

import React from 'react';
import ReactDOM from 'react-dom';
import { Popover, OverlayTrigger, Navbar, Nav, NavItem } from 'react-bootstrap';
import { Router, Route, IndexRedirect } from 'react-router';
import { IntlProvider } from 'react-intl';
import toastr from 'toastr';

import Info from './info';
import Settings from './settings/settings';
import Containers from './containers/containers';
import CreateContainer from './containers/create/create';
import ConsoleContainer from './containers/console/console';
import LogsContainer from './containers/logs/logs';
import Images from './images/images';
import docker from './lib/docker';

toastr.options = {
  'closeButton': false,
  'debug': false,
  'newestOnTop': true,
  'progressBar': true,
  'positionClass': 'toast-bottom-right',
  'preventDuplicates': false,
  'onclick': null,
  'showDuration': 200,
  'hideDuration': 200,
  'timeOut': 5000,
  'extendedTimeOut': 2000,
  'showEasing': 'swing',
  'hideEasing': 'linear',
  'showMethod': 'slideDown',
  'hideMethod': 'slideUp'
};

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
    const activeClass = (link) => this.props.history.isActive(`/${link}`) ? 'active' : 'inactive';
    const goTo = (link) => () => this.props.history.push(link);
    const links = [ 'containers', 'images' ];
    return (
      <div>
        <Navbar staticTop fluid>
          <Navbar.Header>
            <Navbar.Brand>
              Dockra
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
                { links.map((link, key) => (
                  <NavItem key={key} onClick={goTo(link)} className={ activeClass(`/${link}`) }>
                    {link}
                  </NavItem>
                )) }
            </Nav>
            <Nav pullRight>
              <NavItem>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Popover id="popover-info"><Info data={this.state.info} version={this.state.version} /></Popover>}
                    delayHide={2000}
                    rootClose={true}>
                    <i className="fa fa-info fa-lg"></i>
                  </OverlayTrigger>
              </NavItem>
              <NavItem eventKey="settings" onClick={goTo('settings')} className={ activeClass('settings') }>
                <i className="fa fa-cog fa-lg fa-spin-hover"></i>
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
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
          <Route path="containers/logs/:containerId" component={LogsContainer} />
          <Route path="images" component={Images} />
        </Route>
      </Router>
    </IntlProvider>
), document.getElementById('content'));
