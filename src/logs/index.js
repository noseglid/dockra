import React from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';

import { getContainer } from '../lib/docker';
import { FoldingCube } from '../components/spinner';

export default React.createClass({
  mixins: [ LinkedStateMixin ],

  getInitialState() {
    return {
      opts: {
        stdout: 1,
        stderr: 1,
        tail: 100,
        follow: 1
      },
      output: ''
    };
  },

  componentWillMount() {
    const container = getContainer(this.props.params.id);
    container.logsAsync(this.state.opts).then(stream => {
      this.setState({ stream: stream });
      let nextLen = -1;
      stream.on('data', (buf) => {
        if (nextLen === -1) {
          return (nextLen = 1);
        }
        this.setState({ output: this.state.output + buf.toString('utf8') });
        nextLen = -1;
      });
    });
  },

  componentDidUpdate() {
    window.scrollTo(0, document.body.scrollHeight);
  },

  componentWillUnmount() {
    this.state.stream.removeAllListeners();
    this.state.stream.destroy();
    this.setState({ stream: null });
  },

  render() {
    return (
      <div className="container-fluid" id="logs">
        <h1>Logs</h1>
        <form>
          <input type="number" className="form-control" valueLink={this.linkState('filter')} />
        </form>
        <p>{ this.state.filter }</p>
        <pre>{ this.state.output }</pre>
        <FoldingCube />
      </div>
    );
  }
});
