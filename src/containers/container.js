'use babel';

import React from 'react';
import moment from 'moment';
import ControlButton from './control-button';
import { CubeGrid } from '../components/spinner';

function shortify(hash, len = 12) {
  return hash.substr(0, len);
}

function formatNames(names) {
  return names
    .map(n => n.substr(1))
    .filter(n => (n.match(/\//) || []).length === 0)
    .join(', ');
}

export default React.createClass({
  render() {
    const control = [
      {
        icon: 'play',
        title: 'Start',
        action: 'start',
        onClick: this.props.doAction
      },
      {
        icon: 'stop',
        title: 'Stop',
        action: 'stop',
        onClick: this.props.doAction
      },
      {
        icon: 'repeat',
        title: 'Restart',
        action: 'restart',
        onClick: this.props.doAction
      },
      {
        icon: 'align-left',
        title: 'Logs',
        action: 'logs',
        onClick: this.props.doAction
      }
    ];

    return (
      <tr>
        <td>{ formatNames(this.props.Names) }</td>
        <td>{ shortify(this.props.Id) }</td>
        <td>{ this.props.Image.split(':')[0] } (<small>{ shortify(this.props.ImageID) }</small>)</td>
        <td>{ this.props.Image.split(':')[1] || '<unkown>'}</td>
        <td>{ moment.unix(this.props.Created).format('llll') }</td>
        <td>{ this.props.Status }</td>
        <td>
          <fieldset disabled={this.props.loading}>
            <div className="btn-group">
              { control.map(c => <ControlButton key={c.title} containerId={this.props.Id} {...c} />) }
            </div>
          </fieldset>
        </td>
        <td>{ this.props.loading ? <CubeGrid fadeIn /> : '' }</td>
      </tr>
    );
  }
});
