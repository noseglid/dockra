import React from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';

import { getContainer } from '../lib/docker';
import { FoldingCube } from '../components/spinner';
import OutputBox from './output-box';

export default React.createClass({
  mixins: [ LinkedStateMixin ],

  getInitialState() {
    return {
      output: '',
      scroll: true,
      wrap: false,
      running: undefined
    };
  },

  componentWillMount() {
    const container = getContainer(this.props.params.id);

    container.inspectAsync((err, data) => {
      this.setState({ running: !err && data.State.Running });

      const opts = {
        stdout: 1,
        stderr: 1,
        tail: 100,
        follow: 1
      };
      return container.logsAsync(opts).then(stream => {
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
    });
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
        <form className="form-inline">
          <div className="form-group">
            <div className="checkbox-inline">
              <label><input type="checkbox" checkedLink={this.linkState('scroll')} />Scroll on log message</label>
            </div>
            <div className="checkbox-inline">
              <label><input type="checkbox" checkedLink={this.linkState('wrap')} />Wrap lines</label>
            </div>
          </div>
        </form>
        <OutputBox noWrap={!this.state.wrap} output={this.state.output} scroll={this.state.scroll} />
        { this.state.running ? <FoldingCube /> : '' }
      </div>
    );
  }
});
