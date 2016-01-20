import React from 'react';
import DockerMachineSetting from './docker-machine-setting';
import DockerMachinePathSetting from './docker-machine-path-setting';

export default class Settings extends React.Component {
  render() {
    return (
      <div className="container">
        <h1>Settings</h1>
        <form className="form-horizontal">
          <div className="form-group">
            <label htmlFor="input-docker-machine" className="control-label col-sm-3">Docker machine</label>
            <div className="col-sm-9"><DockerMachineSetting id="input-docker-machine" /></div>
          </div>

          <div className="form-group">
            <label htmlFor="input-docker-machine-path" className="control-label col-sm-3">Docker machine path</label>
            <div className="col-sm-9"><DockerMachinePathSetting id="input-docker-machine-path" /></div>
          </div>
        </form>
      </div>
    );
  }
}
