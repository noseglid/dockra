import React from 'react';
import Select from 'react-select';
import { delimiter } from 'path';
import { DockerMachine } from 'nodedm';
import config from '../config';
import ControlButton from '../components/control-button';

export default class DockerMachineSetting extends React.Component {

  constructor(props) {
    super(props);
    this.dockerMachine = this.createMachineBinding();

    this.state = {
      machines: [],
      activeDockerUrl: config.get('docker.host'),
      machineChangePending: true
    };
  }

  componentWillMount() {
    this.listMachines();

    config.on('changed:dockerMachine.path', this.machinePathChanged);
  }

  componentWillUnmount() {
    config.removeListener('changed:dockerMachine.path', this.machinePathChanged);
  }

  machinePathChanged = () => {
    this.dockerMachine = this.createMachineBinding();
    this.listMachines();
  };

  createMachineBinding = () => {
    const env = Object.assign({}, process.env, {
      PATH: `${config.get('dockerMachine.path')}${delimiter}${process.env.PATH}`
    });
    return new DockerMachine('docker-machine', { execOptions: { env: env } });
  };

  listMachines = () => {
    this.setState({ machineChangePending: true });
    this.dockerMachine.ls()
      .then(machines => this.setState({ machines: machines, machineChangePending: false }))
      .catch(err => {
        this.setState({
          machineChangePending: false
        });
        console.error(err);
      });
  };

  startMachine = (machineName) => {
    const machine = this.state.machines.find(m => machineName === m.name);
    machine.stateChanging = true;
    machine.state = 'Booting...';
    this.dockerMachine.start(machineName).then(() => this.listMachines());
    this.forceUpdate();
  };

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

  renderOption = (option) => {
    const machine = this.state.machines.find(m => option.value === m.name);
    const startButton = <ControlButton
      icon={machine.stateChanging ? 'circle-o-notch' : 'play'}
      callback={this.startMachine.bind(this, option.value)}
      disabled={machine.stateChanging}
      spin={machine.stateChanging}
      />;
    return <span>{ option.label } { option.disabled && startButton }</span>;
  };

  render() {
    const machineOptions = this.state.machines.map(m => ({
      value: m.name,
      label: `${m.name} (${m.url || m.state})`,
      disabled: m.state !== 'Running'
    }));
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
          optionRenderer={this.renderOption}
          />
        <span className="help-text">The machine which is used to connect to docker.</span>
      </div>
    );
  }
}
