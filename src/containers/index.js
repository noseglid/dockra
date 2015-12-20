import Promise from 'bluebird';
import React from 'react';
import Container from './container';
import humane from 'humane-js';
import Modal from '../components/modal';
import { listContainers, getContainer } from '../lib/docker';

export default React.createClass({
  getInitialState() {
    return {
      containers: []
    };
  },

  getContainers() {
    listContainers({ all: 1 })
      .map(container => Object.assign({}, container, getContainer(container.Id)))
      .then(containers => this.setState( { containers: containers }))
      .catch(err => humane.error(err.message));
  },

  componentDidMount() {
    this.getContainers();
  },

  doAction(containerId, action) {
    const container = Promise.promisifyAll(getContainer(containerId));
    let p;
    switch (action) {
      case 'stop':
        p = container.stopAsync().finally(() => this.getContainers());
        break;
      case 'start':
        p = container.startAsync().finally(() => this.getContainers());
        break;
      case 'restart':
        p = container.restartAsync().delay(3000).finally(() => this.getContainers());
        break;
      case 'logs':
        return this.props.history.pushState(null, `/logs/${containerId}`);
      default:
        console.error('Invalid container action:', action);
    }

    this.state.containers.find(c => containerId === c.Id).loading = true;
    this.forceUpdate();

    p.catch(err => humane.error(`Failed to ${action} container: ${err.message}`));
  },

  nameFilterChange(event) {
    this.setState({ nameFilter: event.target.value });
  },

  containerFilter(container) {
    if (!this.state.nameFilter) {
      return true;
    }

    return container.Names
      .map(n => (-1 !== n.indexOf(this.state.nameFilter)))
      .reduce((prev, curr) => prev || curr, false);
  },

  render() {
    const filteredContainers = this.state.containers.filter(this.containerFilter);
    return (
      <div id="containers" className="container">
        { this.state.logs ? <Modal logs={this.state.logs} /> : '' }
        <form className="form-horizontal">
          <div className="form-group">
            <div className="col-sm-12">
              <input className="form-control" placeholder="Search" type="text" value={this.state.nameFilter} onChange={this.nameFilterChange} />
            </div>
          </div>
        </form>
        <h3>Containers <small>{filteredContainers.length} containers listed</small></h3>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Names</th>
              <th>ID</th>
              <th>Image</th>
              <th>Version</th>
              <th>Created</th>
              <th>Status</th>
              <th>Control</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            { filteredContainers.map(c => <Container doAction={this.doAction} key={c.Id} {...c} />) }
          </tbody>
        </table>
      </div>
    );
  }
});
