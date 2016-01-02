'use babel';

import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { CubeGrid } from '../components/spinner';
import controls from './container-controls.js';
import ControlButtons from '../components/control-buttons';
import format from '../lib/format';

export default React.createClass({
  render() {
    const formattedName = format.containerName(this.props.Name);
    const rowClassNames = classNames({
      success: this.props.State.Running,
      warning: !this.props.State.Running
    });
    return (
      <tr className={rowClassNames}>
        <td title={formattedName}>{ formattedName }</td>
        <td>{ format.hash(this.props.Id) }</td>
        <td>{ this.props.Image.split(':')[0] } (<small>{ format.hash(this.props.ImageID) }</small>)</td>
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
