import React from 'react';
import linkState from 'react-link-state';
import humane from 'humane-js';
import ListFilter from '../components/list-filter';
import Image from './image';
import PullControls from './pull-controls';
import PullStatus from './pull-status';
import { FormattedPlural } from 'react-intl';
import docker from '../lib/docker';

export default class Images extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      images: [],
      layers: {},
      nameFilter: '',
      repo: '',
      tag: '',
      pulling: false
    };
  }

  componentWillMount() {
    this.getImages();
    this.subscribeEvents();
  }

  componentWillUnmount() {
    this.dockerEvents.destroy();
  }

  getImages = () => {
    return docker.listImages()
      .map(image => Object.assign({}, image, docker.getImage(image.Id)))
      .then(images => images.sort((lhs, rhs) => lhs.Id.localeCompare(rhs.Id)))
      .then(images => this.setState({ images: images }))
      .catch(err => {
        console.error(err);
        humane.error(err.message);
      });
  };

  subscribeEvents = () => {
    docker.getEvents().then(dockerEvents => {
      this.dockerEvents = dockerEvents;
      dockerEvents.on('delete', () => this.getImages());
      dockerEvents.on('pull', () => this.getImages());
      dockerEvents.on('import', () => this.getImages());
    });
  };

  pull = () => {
    const t = `${this.state.repo}:${this.state.tag || 'latest'}`;
    this.setState({ pulling: true });
    docker.pull(t)
      .then((stream) => {
        return new Promise((resolve, reject) => {
          stream.on('data', buf => {
            const ev = JSON.parse(buf.toString('utf8'));
            if (ev.error) {
              stream.removeAllListeners();
              reject(new Error(ev.error));
              return;
            }

            if (!ev.progressDetail) {
              /* not layer progress event */
              return;
            }

            const layers = this.state.layers;
            if (ev.id in layers) {
              /* existing layer, update values */
              layers[ev.id].ev = ev;
              const now = new Date();
              if (ev.progressDetail.current && ev.progressDetail.total &&
                1000 < now - layers[ev.id].speed.lastUpdate) {
                const byteDiff = (ev.progressDetail.current - layers[ev.id].speed.lastBytes);
                const timeDiff = now - layers[ev.id].speed.lastUpdate;
                layers[ev.id].speed = {
                  bytesPerSecond: 1000 * Math.round(byteDiff / timeDiff),
                  lastUpdate: now,
                  lastBytes: ev.progressDetail.current
                };
              }
            } else {
              /* new layer, initialize */
              layers[ev.id] = {
                ev: ev,
                speed: {
                  lastUpdate: new Date(),
                  lastBytes: 0,
                  bytesPerSecond: 0
                }
              };
            }

            if (this.isMounted()) {
              this.setState({ layers: layers });
            }
          });
          stream.on('end', resolve);
          stream.on('error', reject);
        });
      })
      .catch(err => {
        console.error(err);
        humane.error(`Failed to pull ${t}: ${err.message}`);
      })
      .finally(() => {
        if (this.isMounted()) {
          this.getImages();
          this.setState({ layers: {}, pulling: false });
        }
      });
  };

  imageFilter = (image) => {
    const f = this.state.nameFilter;

    if (!f || // No filter - include all
        image.repo.indexOf(f) !== -1 || // Repo contains filter
        image.tag.indexOf(f) !== -1) { // Tag contains filter
      return true;
    }

    return false;
  };

  doAction = (action, imageId) => {
    const image = docker.getImage(imageId);
    let promise;
    switch (action) {
      case 'remove':
        promise = image.removeAsync({ force: true });
        break;

      case 'create':
        return this.props.history.push(`/containers/create/${imageId}`);
    }
    this.state.images.find(i => i.Id === imageId).loading = true;
    this.forceUpdate();

    promise.catch(err => humane.error(`Failed to ${action}: ${err.message}`));
  };

  render() {
    const rows = [].concat.apply([], this.state.images.map(image => image.RepoTags.map(repoTag => ({
      repo: repoTag.split(':')[0],
      tag: repoTag.split(':')[1],
      virtualSize: image.VirtualSize,
      loading: image.loading,
      id: image.Id
    }))));
    const filteredImages = rows.filter(this.imageFilter);
    return (
      <div id="images" className="container">
        <PullControls pulling={this.state.pulling} tag={linkState(this, 'tag')} repo={linkState(this, 'repo')} onClick={this.pull} />
        <PullStatus layers={this.state.layers} />

        <h1>Images <small>{ filteredImages.length } <FormattedPlural one="image" other="images" value={filteredImages.length} /></small></h1>
        <ListFilter freeText={linkState(this, 'nameFilter')} />
        <table className="table table-striped filtered">
          <thead>
            <tr>
              <th>Repository</th>
              <th>Tags</th>
              <th>Virtual Size</th>
              <th>Id</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            { filteredImages.map((image, index) => <Image doAction={this.doAction} key={index} {...image} />) }
          </tbody>
        </table>
      </div>
    );
  }
}
