'use babel';

import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { CubeGrid } from '../components/spinner';
import controls from './container-controls.js';
import ControlButtons from '../components/control-buttons';

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
    const formattedNames = formatNames(this.props.Names);
    const rowClassNames = classNames({
      success: this.props.State.Running,
      danger: !this.props.State.Running
    });
    console.log(rowClassNames);
    return (
      <tr className={rowClassNames}>
        <td title={formattedNames}>{ formattedNames }</td>
        <td>{ shortify(this.props.Id) }</td>
        <td>{ this.props.Image.split(':')[0] } (<small>{ shortify(this.props.ImageID) }</small>)</td>
        <td>{ this.props.Image.split(':')[1] || '<unkown>'}</td>
        <td>{ moment.unix(this.props.Created).format('llll') }</td>
        <td>{ this.props.State.Running ? 'Up' : 'Down' }</td>
        <td><ControlButtons buttons={controls}
                            callback={ this.props.doAction }
                            callbackArgs={ this.props.Id }
                            disabled={ this.props.loading } /></td>
        <td>{ this.props.loading ? <CubeGrid fadeIn /> : '' }</td>
      </tr>
    );
  }
});
