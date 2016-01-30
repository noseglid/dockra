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

    this.reallyDestroyTerminal = this.state.terminal.destroy.bind(this.state.terminal);

    if (this.props.ignoreStreamEnd) {
      this.state.terminal.destroy = () => { /* no-op in this case */ };
      this.state.terminal.destroySoon = () => { /* no-op in this case */ };
    }
  }

  getFontGeometry = () => {
    const o = $('<div>A</div>')
      .addClass('terminal-test')
      .appendTo($('body'));
    const w = o[0].getBoundingClientRect().width;
    const h = o[0].getBoundingClientRect().height;
    o.remove();
    return { w: w, h: h};
  };

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
    this.reallyDestroyTerminal();
  }

  terminalGeometry() {
    const fontGeometry = this.getFontGeometry();
    return {
      w: Math.floor($('.terminal').width() / fontGeometry.w),
      h: Math.floor($('.terminal').height() / fontGeometry.h)
    };
  }

  handleResize = () => {
    $('.terminal').css('top', $('.terminal').parent().position().top + 'px');

    const geometry = this.terminalGeometry();
    this.state.terminal.resize(geometry.w, geometry.h);

    if (this.props.onResize) {
      this.props.onResize(geometry.w, geometry.h);
    }
  };

  render() {
    return (<div></div>);
  }
}

Terminal.propTypes = {
  stream: React.PropTypes.instanceOf(stream.Readable),
  twoWay: React.PropTypes.bool,
  onResize: React.PropTypes.function
};
