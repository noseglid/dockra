import React from 'react';
import filesize from 'filesize';
import moment from 'moment';

class Info extends React.Component {
  render() {
    if (!this.props.data || !this.props.version) {
      return <div>No contact with docker server</div>;
    }
    return (
      <div>
        <div>Server version: <code>{this.props.data.ServerVersion}</code></div>
        <div>API version: <code>{this.props.version.ApiVersion}</code></div>
        <div>Kernel version: <code>{this.props.data.KernelVersion}</code></div>
        <div>Architecture: <code>{this.props.data.Architecture}</code></div>
        <div>Operating system: <code>{this.props.data.OSType}</code></div>
        <div>Total memory: <code>{filesize(this.props.data.MemTotal)}</code></div>
        <div>Number of CPUs: <code>{this.props.data.NCPU}</code></div>
        <div>Server time: <code>{moment(this.props.data.SystemTime).format()}</code></div>
        <div>Index server: <code>{this.props.data.IndexServerAddress}</code></div>
      </div>
    );
  }
}

export default Info;
