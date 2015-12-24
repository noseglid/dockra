import Promise from 'bluebird';
import React from 'react';
import { IntlMixin, FormattedMessage } from 'react-intl';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import humane from 'humane-js';
import ListFilter from '../components/list-filter';
import Container from './container';
import { listContainers, getContainer } from '../lib/docker';

export default React.createClass({
  mixins: [ IntlMixin, LinkedStateMixin ],

  getInitialState() {
    return {
      containers: []
    };
  },

  getContainers() {
    listContainers({ all: 1 })
      .map(container => Object.assign({}, container, getContainer(container.Id)))
      .then(containers => this.setState({ containers: containers }))
      .catch(err => humane.error(err.message));
  },

  componentDidMount() {
    this.getContainers();
  },

  doAction(action, containerId) {
    const container = Promise.promisifyAll(getContainer(containerId));
    let promise;
    switch (action) {
      case 'stop':
      case 'start':
      case 'restart':
      case 'remove':
        promise = container[`${action}Async`]().finally(() => this.getContainers());
        break;
      case 'logs':
        return this.props.history.push(`/logs/${containerId}`);
      default:
        console.error('Invalid container action:', action);
        return false;
    }

    this.state.containers.find(c => containerId === c.Id).loading = true;
    this.forceUpdate();

    promise.catch(err => humane.error(`Failed to ${action} container: ${err.message}`));
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
        <h1>Containers <small><FormattedMessage message={this.getIntlMessage('containers.filtered')} num={filteredContainers.length} /></small></h1>
        <ListFilter freeText={this.linkState('nameFilter')} />
        <table className="table table-striped filtered">
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
