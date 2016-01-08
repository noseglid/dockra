import React from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import $ from 'jquery';
import Terminal from 'term.js';

import docker from '../lib/docker';
import { FoldingCube } from '../components/spinner';

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
    const container = docker.getContainer(this.props.params.id);

    container.inspectAsync((err, data) => {
      this.setState({ running: !err && data.State.Running });

      const opts = {
        stdout: 1,
        stderr: 1,
        tail: 100,
        follow: 1
      };
      return container.logsAsync(opts).then(stream => {
        const geometry = {
          w: Math.floor($('#console').width() / 7.29), // 7.29 is the width of 12px Menlo font
          h: 40
        };
        const terminal = new Terminal({
          geometry: [ geometry.w, geometry.h ],
          screenKeys: true,
          termName: 'xterm-256color',
          useStyle: true
        });
        this.setState({ stream: stream });
        terminal.open(document.getElementById('console'));
        stream.setEncoding('utf8');
        stream.pipe(terminal);
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
        <div id="console"></div>
        { this.state.running ? <FoldingCube /> : '' }
      </div>
    );
  }
});
