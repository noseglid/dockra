import React from 'react';
import ReactDOM from 'react-dom';
import Terminal from 'term.js';
import $ from 'jquery';
import stream from 'stream';

export default class ReactTerminal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      terminal: new Terminal({
        screenKeys: true,
        termName: 'xterm-256color',
        useStyle: true
      })
    };
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.state.terminal.open(ReactDOM.findDOMNode(this));

    this.props.stream.setEncoding('utf8');
    this.props.stream.pipe(this.state.terminal);

    if (this.props.twoWay) {
      this.state.terminal.pipe(this.props.stream);
    }

    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    this.state.terminal.destroy();
  }

  terminalGeometry() {
    return {
      w: Math.floor($('.terminal').width() / 7.21), // 7.21 is the width of 12px Menlo font
      h: Math.floor($('.terminal').height() / 17) // 17 is the  line height
    };
  }

  handleResize() {
    const geometry = this.terminalGeometry();
    this.state.terminal.resize(geometry.w, geometry.h);
    this.props.exec.resizeAsync(geometry);
  }

  render() {
    return (<div></div>);
  }
}

Terminal.propTypes = {
  stream: React.PropTypes.instanceOf(stream.Readable),
  twoWay: React.PropTypes.bool
};
