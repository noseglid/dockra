import Promise from 'bluebird';
import React from 'react';
import { IntlMixin, FormattedMessage } from 'react-intl';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import humane from 'humane-js';
import classNames from 'classnames';
import ListFilter from '../components/list-filter';
import Container from './container';
import docker from '../lib/docker';
import format from '../lib/format';

function genericCompare(lhs, rhs, dir) {
  if (lhs === rhs) return 0;
  return (lhs < rhs ? -1 : 1) * (dir === 'desc' ? 1 : -1);
}

export default React.createClass({
  mixins: [ IntlMixin, LinkedStateMixin ],

  getInitialState() {
    return {
      containers: [],
      sort: {
        column: 'names',
        direction: 'desc'
      }
    };
  },

  sortContainers(lhs, rhs) {
    const sort = this.state.sort;
    switch (sort.column) {
      case 'names':
        const n1 = format.containerName(lhs.Name).toLowerCase();
        const n2 = format.containerName(rhs.Name).toLowerCase();
        return genericCompare(n1, n2, sort.direction);
      case 'id':
        return genericCompare(lhs.Id, rhs.Id, sort.direction);
      case 'image':
        const i1 = lhs.Image.split(':')[0];
        const i2 = rhs.Image.split(':')[0];
        return genericCompare(i1, i2, sort.direction);
      case 'version':
        const v1 = lhs.Image.split(':')[1] || '<unknown>';
        const v2 = rhs.Image.split(':')[1] || '<unknown>';
        return genericCompare(v1, v2, sort.direction);
      case 'created':
        return genericCompare(lhs.Created, rhs.Created, sort.direction);
      case 'state':
        const intDirection = (sort.direction === 'desc' ? 1 : -1);
        return lhs.State.Running === rhs.State.Running ? 0 : intDirection;
      default:
        return -1;
    }
  },

  getContainers() {
    docker.listContainers({ all: 1 })
      .then(containers => {
        Promise.all(containers.map(c => docker.getContainer(c.Id).inspectAsync()))
          .then(res => containers.map((c, i) => Object.assign({}, res[i], c)))
          .then(c => this.setState({ containers: c }));
      })
      .catch(err => {
        console.error(err);
        humane.error(err.message);
      });
  },

  componentWillMount() {
    this.getContainers();
  },

  doAction(action, containerId) {
    const container = docker.getContainer(containerId);
    let promise;
    switch (action) {
      case 'stop':
      case 'start':
      case 'restart':
      case 'remove':
        promise = container[`${action}Async`]().finally(() => this.getContainers());
        break;
      case 'logs':
      case 'console':
        return this.props.history.push(`/containers/${action}/${containerId}`);
      default:
        console.error('Invalid container action:', action);
        return false;
    }

    this.state.containers.find(c => containerId === c.Id).loading = true;
    this.forceUpdate();

    promise.catch(err => {
      console.error(err);
      humane.error(`Failed to ${action} container: ${err.message}`);
    });
  },

  containerFilter(container) {
    const f = this.state.nameFilter;
    if (!f) {
      return true;
    }

    if (format.containerName(container.Name).indexOf(f) !== -1) {
      return true;
    }

    if (container.Id.indexOf(f) !== -1) {
      return true;
    }

    return false;
  },

  nextDirection(currentDirection) {
    if (currentDirection === 'both') return 'desc';
    if (currentDirection === 'desc') return 'asc';
    if (currentDirection === 'asc') return 'desc';
  },

  sortColumn(e) {
    let nd;
    let nc;
    if (e.target.innerText.toLowerCase() === this.state.sort.column) {
      /* same column, change direction */
      nd = this.nextDirection(this.state.sort.direction);
      nc = this.state.sort.column;
    } else {
      /* new column, reset direction, change column */
      nd = this.nextDirection('both');
      nc = e.target.innerText.toLowerCase();
    }
    this.setState({ sort: { column: nc, direction: nd } });
  },

  render() {
    const filteredContainers = this.state.containers.filter(this.containerFilter).sort(this.sortContainers);
    return (
      <div id="containers" className="container">
        <h1>Containers <small><FormattedMessage message={this.getIntlMessage('containers.filtered')} num={filteredContainers.length} /></small></h1>
        <ListFilter freeText={this.linkState('nameFilter')} />
        <table className="table filtered sortable">
          <thead>
            <tr>
              {
                [ 'Names', 'Id', 'Image', 'Version', 'Created', 'State' ].map(col => {
                  const cl = classNames('sort', {
                    [ `sort-${this.state.sort.direction}` ]: this.state.sort.column === col.toLowerCase(),
                    [ `sort-both` ]: this.state.sort.column !== col.toLowerCase()
                  });
                  return (<th key={col} className={cl} onClick={this.sortColumn}>{col}</th>);
                })
              }
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
