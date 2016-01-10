import React from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';

import docker from '../lib/docker';
import format from '../lib/format';
import Terminal from '../components/terminal';
import StripHeader from './strip-header';

export default React.createClass({
  mixins: [ LinkedStateMixin ],

  getInitialState() {
    return {
      containerName: this.props.params.id
    };
  },

  componentWillMount() {
    const container = docker.getContainer(this.props.params.id);

    container.inspectAsync((err, data) => {
      const opts = {
        stdout: 1,
        stderr: 1,
        tail: 100,
        follow: 1
      };
      return container.logsAsync(opts).then(stream => {
        stream.on('end', () => console.log('end'));
        let terminalStream = stream;
        if (!data.Config.Tty) {
          /* Each frame is prepended with header if tty is not attached. Strip these. */
          terminalStream = terminalStream.pipe(new StripHeader());
        }
        this.setState({
          stream: stream,
          terminalStream: terminalStream,
          containerName: format.containerName(data.Name)
        });
      });
    });
  },

  componentWillUnmount() {
    this.state.terminalStream.removeAllListeners();
    this.state.stream.removeAllListeners();
    this.state.stream.destroy();
    this.setState({ streamRaw: null, stream: null });
  },

  render() {
    const terminalComponent = this.state.terminalStream ?
      <Terminal stream={this.state.terminalStream} /> : null;

    return (
      <div className="container-fluid" id="logs">
        <h1>Logs</h1>
        { terminalComponent }
      </div>
    );
  }
});
