import React from 'react';
import filesize from 'filesize';
import moment from 'moment';

class Info extends React.Component {
  render() {
    if (!this.props.data || !this.props.version) {
      return <div>No contact with docker server</div>;
    }
    return (
      <table className="table borderless table-condensed">
        <tbody>
          <tr>
            <td>Server version:</td>
            <td><code>{this.props.data.ServerVersion}</code></td>
          </tr>
          <tr>
            <td>API version:</td>
            <td><code>{this.props.version.ApiVersion}</code></td>
          </tr>
          <tr>
            <td>Kernel version:</td>
            <td><code>{this.props.data.KernelVersion}</code></td>
          </tr>
          <tr>
            <td>Architecture:</td>
            <td><code>{this.props.data.Architecture}</code></td>
          </tr>
          <tr>
            <td>Operating system:</td>
            <td><code>{this.props.data.OSType}</code></td>
          </tr>
          <tr>
            <td>Total memory:</td>
            <td><code>{filesize(this.props.data.MemTotal)}</code></td>
          </tr>
          <tr>
            <td>Number of CPUs:</td>
            <td><code>{this.props.data.NCPU}</code></td>
          </tr>
          <tr>
            <td>Server time:</td>
            <td><code>{moment(this.props.data.SystemTime).format()}</code></td>
          </tr>
          <tr>
            <td>Index server:</td>
            <td><code>{this.props.data.IndexServerAddress}</code></td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default Info;
