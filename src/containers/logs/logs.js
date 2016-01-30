import React from 'react';

import docker from '../../lib/docker';
import format from '../../lib/format';
import Terminal from '../../components/terminal';
import StripHeader from './strip-header';

export default class ContainerLogs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      containerName: format.hash(this.props.params.id)
    };
  }

  componentWillMount() {
    const opts = {
      stdout: 1,
      stderr: 1,
      tail: 100,
      follow: 1
    };

    docker.getContainer(this.props.params.id)
      .then(container => Promise.all([ container.inspectAsync(), container.logsAsync(opts) ]))
      .spread((container, stream) => {
        let terminalStream = stream;
        if (!container.Config.Tty) {
          /* Each frame is prepended with header if tty is not attached. Strip these. */
          terminalStream = terminalStream.pipe(new StripHeader());
        }
        this.setState({
          stream: stream,
          terminalStream: terminalStream,
          containerName: format.containerName(container.Name)
        });
      })
      .catch(err => console.error(err));
  }

  componentWillUnmount() {
    if (this.state.terminalStream) {
      this.state.terminalStream.removeAllListeners();
    }

    if (this.state.stream) {
      this.state.stream.removeAllListeners();
      this.state.stream.destroy();
    }

    this.setState({ stream: null, terminalStream: null });
  }

  render() {
    const terminalComponent = this.state.terminalStream ?
      <Terminal stream={this.state.terminalStream} ignoreStreamEnd={true} /> : null;

    return (
      <div className="container-fluid" id="logs">
        <h1>Logs from <code>{this.state.containerName}</code></h1>
        { terminalComponent }
      </div>
    );
  }
}
