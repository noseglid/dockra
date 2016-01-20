import React from 'react';
import config from '../config';

class DockerMachinePathSetting extends React.Component {
  onChange = (ev) => {
    config.set('dockerMachine.path', ev.target.value);
    this.forceUpdate();
  };

  render() {
    return (
      <div>
        <input
          value={config.get('dockerMachine.path')}
          onChange={this.onChange}
          type="text"
          className="form-control"
          id={this.props.id}
        />
        <span className="help-text">
          Leave empty to adhere to <code>PATH</code> settings.
          A common value for OS X and Linux is <code>/usr/local/bin</code>.
        </span>
      </div>
    );
  }
}

export default DockerMachinePathSetting;
