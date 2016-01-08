import React from 'react';
import Terminal from 'term.js';
import $ from 'jquery';
import docker from '../../lib/docker';
import format from '../../lib/format';

export default class Console extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      containerName: format.hash(this.props.params.containerId)
    };
  }

  componentDidMount() {
    const geometry = {
      w: Math.floor($('#console').width() / 7.29), // 7.29 is the width of 12px Menlo font
      h: 60
    };
    const terminal = new Terminal({
      geometry: [ geometry.w, geometry.h ],
      screenKeys: true,
      termName: 'xterm-256color',
      useStyle: true
    });
    terminal.open(document.getElementById('console'));

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
      .then(exec => Promise.all([ exec.startAsync(startOpts), exec.resizeAsync(geometry) ]))
      .spread(stream => {
        stream.setEncoding('utf8');
        terminal.pipe(stream);
        stream.pipe(terminal);
      });
  }

  componentWillMount() {
    docker.getContainer(this.props.params.containerId).inspectAsync()
      .then(container => this.setState({ containerName: format.containerName(container.Name) }));
  }

  render() {
    return (
      <div className="container-fluid" id="console">
        <h1><code>{this.state.containerName}</code> console</h1>
        <div id="console"></div>
      </div>
    );
  }
}
