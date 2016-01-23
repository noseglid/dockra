'use babel';

import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import ControlButton from '../components/control-button';
import format from '../lib/format';

export default class Container extends React.Component {
  render() {
    const formattedName = format.containerName(this.props.Name);
    const rowClassNames = classNames({
      success: this.props.State.Running,
      warning: !this.props.State.Running,
      loading: this.props.loading
    });
    return (
      <tr className={rowClassNames}>
        <td title={formattedName}>{ formattedName }</td>
        <td>{ this.props.Image }</td>
        <td>{ moment.unix(this.props.Created).fromNow() }</td>
        <td>
          {
            this.props.Ports.filter(port => port.PublicPort).map(port => <div key={port.PublicPort}>
              { `${port.IP}:${port.PublicPort}` }
              <i className="fa fa-long-arrow-right"></i>
              { port.PrivatePort } <small>{ port.Type }</small>
            </div>)
          }
        </td>
        <td>
          <div className="btn-group">
            <ControlButton
              disabled={ this.props.loading || this.props.State.Running }
              callback={ this.props.doAction.bind(null, 'start', this.props.Id) }
              icon="play"
            />
            <ControlButton
              disabled={ this.props.loading || !this.props.State.Running }
              callback={ this.props.doAction.bind(null, 'stop', this.props.Id) }
              icon="stop"
            />
            <ControlButton
              disabled={ this.props.loading }
              callback={ this.props.doAction.bind(null, 'restart', this.props.Id) }
              icon="repeat"
            />
          </div>
          <div className="btn-group">
            <ControlButton
              disabled={ this.props.loading }
              callback={ this.props.doAction.bind(null, 'logs', this.props.Id) }
              icon="align-left"
            />
            <ControlButton
              disabled={ this.props.loading || !this.props.State.Running }
              callback={ this.props.doAction.bind(null, 'console', this.props.Id) }
              icon="console"
            />
            <ControlButton
              disabled={ this.props.loading || this.props.State.Running }
              callback={ this.props.doAction.bind(null, 'remove', this.props.Id) }
              icon="trash"
            />
          </div>
        </td>
      </tr>
    );
  }
}
