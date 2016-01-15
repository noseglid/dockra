import React from 'react';
import filesize from 'filesize';
import controls from './image-controls';
import ControlButtons from '../components/control-buttons';
import { CubeGrid } from '../components/spinner';

export default class Image extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.repo}</td>
        <td>{this.props.tag}</td>
        <td>{filesize(this.props.virtualSize)}</td>
        <td title={this.props.id}>{this.props.id}</td>
        <td><ControlButtons buttons={controls}
                            callback={this.props.doAction}
                            callbackArgs={this.props.id}
                            disabled={this.props.loading} /></td>
        <td>{ this.props.loading ? <CubeGrid fadeIn /> : '' }</td>
      </tr>
    );
  }
}
