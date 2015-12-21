'use babel';

import React from 'react';
import moment from 'moment';
import ControlButton from './control-button';
import { CubeGrid } from '../components/spinner';
import controls from './container-controls.js';

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
    return (
      <tr>
        <td title={formattedNames}>{ formattedNames }</td>
        <td>{ shortify(this.props.Id) }</td>
        <td>{ this.props.Image.split(':')[0] } (<small>{ shortify(this.props.ImageID) }</small>)</td>
        <td>{ this.props.Image.split(':')[1] || '<unkown>'}</td>
        <td>{ moment.unix(this.props.Created).format('llll') }</td>
        <td>{ this.props.Status }</td>
        <td>
          <fieldset disabled={this.props.loading}>
              {
                controls(this.props.doAction).map((row, index) => {
                  return (<div className="btn-group" key={index}>
                    { row.map(c => <ControlButton key={c.action} containerId={this.props.Id} {...c} />) }
                  </div>);
                })
              }
          </fieldset>
        </td>
        <td>{ this.props.loading ? <CubeGrid fadeIn /> : '' }</td>
      </tr>
    );
  }
});
