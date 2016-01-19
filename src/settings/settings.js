import React from 'react';
import DockerMachineSetting from './docker-machine-setting';
import DockerMachineExecutableSetting from './docker-machine-executable-setting';

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
            <label htmlFor="input-docker-machine-executable" className="control-label col-sm-3">Docker machine executable</label>
            <div className="col-sm-9"><DockerMachineExecutableSetting id="input-docker-machine-executable" /></div>
          </div>
        </form>
      </div>
    );
  }
}
