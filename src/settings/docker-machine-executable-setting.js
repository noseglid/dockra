import React from 'react';
import config from '../config';

class DockerMachineExecutableSetting extends React.Component {
  onChange = (ev) => {
    config.set('dockerMachine.executable', ev.target.value);
    this.forceUpdate();
  };

  render() {
    return (
      <div>
        <input
          value={config.get('dockerMachine.executable')}
          onChange={this.onChange}
          type="text"
          className="form-control"
          id={this.props.id}
        />
        <span className="help-text">
          Leave empty to adhere to <code>PATH</code> settings.
          A common value for OS X and Linux is <code>/usr/local/bin/docker-machine</code>.
        </span>
      </div>
    );
  }
}

export default DockerMachineExecutableSetting;
