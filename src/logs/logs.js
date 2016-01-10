import React from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';

import docker from '../lib/docker';
import format from '../lib/format';
import Terminal from '../components/terminal';
import { FoldingCube } from '../components/spinner';
import StripHeader from './strip-header';

export default React.createClass({
  mixins: [ LinkedStateMixin ],

  getInitialState() {
    return {
      containerName: this.props.params.id,
      running: undefined
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
          streamRaw: stream,
          stream: terminalStream,
          containerName: format.containerName(data.Name)
        });
      });
    });
  },

  componentWillUnmount() {
    this.state.stream.removeAllListeners();
    this.state.streamRaw.removeAllListeners();
    this.state.streamRaw.destroy();
    this.setState({ streamRaw: null, stream: null });
  },

  render() {
    const terminalComponent = this.state.stream ?
      <Terminal stream={this.state.stream} /> : null;

    return (
      <div className="container-fluid" id="logs">
        <h1>Logs</h1>
        { terminalComponent }
        { this.state.running ? <FoldingCube /> : '' }
      </div>
    );
  }
});
