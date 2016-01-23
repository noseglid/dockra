import Promise from 'bluebird';
import React from 'react';
import { FormattedPlural } from 'react-intl';
import linkState from 'react-link-state';
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

export default class Containers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      containers: [],
      sort: {
        column: 'names',
        direction: 'desc'
      }
    };
  }

  componentWillMount() {
    this.getContainers();
    this.subscribeEvents();
  }

  componentWillUnmount() {
    if (this.dockerEvents) {
      this.dockerEvents.destroy();
    }
    if (this.listContainersPromise) {
      this.listContainersPromise.cancel();
    }
  }

  sortContainers = (lhs, rhs) => {
    const sort = this.state.sort;
    switch (sort.column) {
      case 'name':
        const n1 = format.containerName(lhs.Name).toLowerCase();
        const n2 = format.containerName(rhs.Name).toLowerCase();
        return genericCompare(n1, n2, sort.direction);
      case 'image':
        const i1 = lhs.Image.split(':')[0];
        const i2 = rhs.Image.split(':')[0];
        return genericCompare(i1, i2, sort.direction);
      case 'created':
        return genericCompare(lhs.Created, rhs.Created, sort.direction);

      case 'ports':
        const lhsMinPort = Math.min(...lhs.Ports.map(p => p.PublicPort)) || 65535;
        const rhsMinPort = Math.min(...rhs.Ports.map(p => p.PublicPort)) || 65535;
        return genericCompare(lhsMinPort, rhsMinPort, sort.direction);
      default:
        return -1;
    }
  };

  getContainers = () => {
    if (this.listContainersPromise) {
      this.listContainersPromise.cancel();
    }

    this.listContainersPromise = docker.listContainers({ all: 1 })
      .then(containers => {
        return Promise.all(containers.map(c => docker.getContainer(c.Id).then(container => container.inspectAsync())))
          .then(res => containers.map((c, i) => Object.assign({}, res[i], c)))
          .then(c => this.setState({ containers: c }));
      })
      .catch(err => {
        console.error(err);
        humane.error(err.message);
      })
      .finally(() => {
        this.listContainersPromise = null;
      });
  };

  subscribeEvents = () => {
    docker.getEvents().then(dockerEvents => {
      this.dockerEvents = dockerEvents;
      dockerEvents.on('start', () => this.getContainers());
      dockerEvents.on('die', () => this.getContainers());
      dockerEvents.on('destroy', () => this.getContainers());
    }).catch(err => {
      humane.info(`Failed to subscribe to docker events due to: '${err.message}'.\nList may be outdated over time`);
      console.error(err);
    });
  };

  doAction = (action, containerId) => {
    docker.getContainer(containerId).then(container => {
      this.state.containers.find(c => containerId === c.Id).loading = true;
      this.forceUpdate();

      switch (action) {
        case 'stop':
          return container.stopAsync({ t: 5 });
        case 'start':
        case 'restart':
        case 'remove':
          return container[`${action}Async`]();
        case 'logs':
        case 'console':
          return this.props.history.push(`/containers/${action}/${containerId}`);
        default:
          console.error('Invalid container action:', action);
          return false;
      }
    })
    .catch(err => {
      console.error(err);
      humane.error(`Failed to ${action} container: ${err.message}`);
    });
  };

  filterContainers = (container) => {
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
  };

  nextDirection = (currentDirection) => {
    if (currentDirection === 'both') return 'desc';
    if (currentDirection === 'desc') return 'asc';
    if (currentDirection === 'asc') return 'desc';
  };

  sortColumn = (e) => {
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
  };

  render() {
    const filteredContainers = this.state.containers.filter(this.filterContainers).sort(this.sortContainers);
    return (
      <div id="containers" className="container">
        <h1>Containers <small>{ filteredContainers.length } <FormattedPlural one="container" other="containers" value={filteredContainers.length} /></small></h1>
        <ListFilter freeText={linkState(this, 'nameFilter')} />
        <table className="table filtered sortable">
          <thead>
            <tr>
              {
                [ 'Name', 'Image', 'Created', 'Ports' ].map(col => {
                  const cl = classNames('sort', {
                    [ `sort-${this.state.sort.direction}` ]: this.state.sort.column === col.toLowerCase(),
                    [ `sort-both` ]: this.state.sort.column !== col.toLowerCase()
                  });
                  return (<th key={col} className={cl} onClick={this.sortColumn}>{col}</th>);
                })
              }
              <th>Control</th>
            </tr>
          </thead>
          <tbody>
            { filteredContainers.map(c => <Container doAction={this.doAction} key={c.Id} {...c} />) }
          </tbody>
        </table>
      </div>
    );
  }
}
