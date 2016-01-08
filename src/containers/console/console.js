import React from 'react';
import Terminal from '../../components/terminal';
import docker from '../../lib/docker';
import format from '../../lib/format';

export default class Console extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      containerName: format.hash(this.props.params.containerId),
      stream: null,
      exec: null
    };
  }

  componentWillMount() {
    docker.getContainer(this.props.params.containerId).inspectAsync()
      .then(container => this.setState({ containerName: format.containerName(container.Name) }));

    const execOpts = {
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      Cmd: [ '/bin/bash' ]
    };

    const startOpts = {
      Detach: false,
      Tty: true,
      hijack: true
    };

    docker.exec(this.props.params.containerId, execOpts)
      .then(exec => Promise.all([ exec, exec.startAsync(startOpts) ]))
      .spread((exec, stream) => {
        this.setState({ stream: stream, exec: exec });
      });
  }

  render() {
    let termComponent = null;
    if (this.state.stream && this.state.exec) {
      termComponent = <Terminal stream={this.state.stream} exec={this.state.exec} twoWay={true} />;
    }

    return (
      <div className="container-fluid" id="console">
        <h1>Console to <code>{this.state.containerName}</code></h1>
        { termComponent }
      </div>
    );
  }
}
