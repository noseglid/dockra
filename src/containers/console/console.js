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

    this.handleResize = this.handleResize.bind(this);
  }

  componentWillMount() {
    docker.getContainer(this.props.params.containerId).inspectAsync()
      .then(container => this.setState({ containerName: format.containerName(container.Name) }));
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);

    const geometry = this.terminalGeometry();
    const terminal = new Terminal({
      geometry: [ geometry.w, geometry.h ],
      screenKeys: true,
      termName: 'xterm-256color',
      useStyle: true
    });
    terminal.open(document.getElementById('terminal'));

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
        stream.setEncoding('utf8');
        terminal.pipe(stream);
        stream.pipe(terminal);

        this.setState({ terminal: terminal, exec: exec });
        this.handleResize();
      });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    this.state.terminal.destroy();
  }

  terminalGeometry() {
    const [ tw, th ] = [ $('#terminal').width(), $('#terminal').height() ];
    if (0 >= tw || 0 >= th) {
      return { w: 1, h: 1 };
    }

    return {
      w: Math.floor((tw - 3.645) / 7.29), // 7.29 is the width of 12px Menlo font
      h: Math.floor((th - 8.5) / 17) // 17 is the  line height
    };
  }

  handleResize() {
    const geometry = this.terminalGeometry();
    this.state.terminal.resize(geometry.w, geometry.h);
    this.state.exec.resizeAsync(geometry);
  }

  render() {
    return (
      <div className="container-fluid" id="console">
        <h1>Console to <code>{this.state.containerName}</code></h1>
        <div id="terminal"></div>
      </div>
    );
  }
}
