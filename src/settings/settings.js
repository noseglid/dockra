import React from 'react';
import DockerMachineSetting from './docker-machine-setting';

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
        </form>
      </div>
    );
  }
}
