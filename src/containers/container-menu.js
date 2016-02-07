import React from 'react';
import { Link } from 'react-router';

class Container extends React.Component {
  render() {
    const logsLink = `/containers/logs/${this.props.containerId}`;
    const consoleLink = `/containers/console/${this.props.containerId}`;
    return (
      <ul className="nav nav-pills">
        <li className={this.props.history.isActive(logsLink) ? 'active' : ''}>
          <Link to={logsLink}>Logs</Link>
        </li>
        <li className={this.props.history.isActive(consoleLink) ? 'active' : ''}>
          <Link to={consoleLink}>Console</Link>
        </li>
      </ul>
    );
  }
}

export default Container;
