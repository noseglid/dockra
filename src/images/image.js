import React from 'react';
import filesize from 'filesize';
import ControlButton from '../components/control-button';
import { CubeGrid } from '../components/spinner';

export default class Image extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.repo}</td>
        <td>{this.props.tag}</td>
        <td>{filesize(this.props.virtualSize)}</td>
        <td title={this.props.id}>{this.props.id}</td>
        <td>
          <div className="row">
            <div className="col-sm-8">
              <div className="btn-group">
                <ControlButton
                  disabled={ this.props.loading }
                  callback={ this.props.doAction.bind(null, 'create', this.props.id) }
                  icon="hdd-o"
                />
                <ControlButton
                  disabled={ this.props.loading }
                  callback={ this.props.doAction.bind(null, 'remove', this.props.id) }
                  icon="minus-square"
                />
              </div>
            </div>
            <div className="col-sm-4">
              { this.props.loading ? <CubeGrid fadeIn /> : '' }
            </div>
          </div>
        </td>
      </tr>
    );
  }
}
