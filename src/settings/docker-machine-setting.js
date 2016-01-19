import React from 'react';
import Select from 'react-select';
import { DockerMachine } from 'nodedm';
import config from '../config';

export default class DockerMachineSetting extends React.Component {

  constructor(props) {
    super(props);
    this.dockerMachine = new DockerMachine(config.get('dockerMachine.executable') || 'docker-machine');
    config.on('changed:dockerMachine.executable', (executable) => {
      this.dockerMachine = new DockerMachine(executable || 'docker-machine');
    });

    this.state = {
      machines: [],
      activeDockerUrl: config.get('docker.host'),
      machineChangePending: true
    };
  }

  componentWillMount() {
    this.dockerMachine.ls()
      .then(machines => this.setState({ machines: machines, machineChangePending: false }))
      .catch(err => {
        this.setState({
          machineChangePending: false
        });
        console.error(err);
      });
  }

  machineChanged = (selected) => {
    const machine = this.state.machines.find(m => selected.value === m.name);
    this.setState({ machineChangePending: true });
    this.dockerMachine.env(selected.value).then(env => {
      const certPath = env.match(/DOCKER_CERT_PATH="([^"]+)"/)[1];
      config.set('docker.host', machine.url);
      config.set('docker.certPath', certPath);
      this.setState({
        activeDockerUrl: config.get('docker.host'),
        machineChangePending: false
      });
    });
  };

  render() {
    const machineOptions = this.state.machines.map(m => ({ value: m.name, label: `${m.name} (${m.url})` }));
    const activeMachine = this.state.machines.find(m => m.url === this.state.activeDockerUrl);

    return (
      <div>
        <Select
          id={this.props.id}
          options={machineOptions}
          value={activeMachine ? activeMachine.name : ''}
          onChange={this.machineChanged}
          isLoading={this.state.machineChangePending }
          clearable={false}
          />
        <span className="help-text">The machine which is used to connect to docker.</span>
      </div>
    );
  }
}
