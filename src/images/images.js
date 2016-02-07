import React from 'react';
import linkState from 'react-link-state';
import toastr from 'toastr';
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
    if (this.dockerEvents) {
      this.dockerEvents.destroy();
    }

    if (this.pullEvents) {
      this.pullEvents.destroy();
    }
  }

  getImages = () => {
    return docker.listImages()
      .map(image => Object.assign({}, image, docker.getImage(image.Id)))
      .then(images => images.sort((lhs, rhs) => lhs.Id.localeCompare(rhs.Id)))
      .then(images => this.setState({ images: images }))
      .catch(err => {
        toastr.warning(err.message, 'Failed to list images');
        console.error(err);
      });
  };

  subscribeEvents = () => {
    docker.getEvents().then(dockerEvents => {
      this.dockerEvents = dockerEvents;
      dockerEvents.on('delete', () => this.getImages());
      dockerEvents.on('pull', () => this.getImages());
      dockerEvents.on('import', () => this.getImages());
    }).catch(err => {
      toastr.warning(`List may be outdated over time. ${err.message}`, 'Failed to subscribe to events');
      console.error(err);
    });
  };

  pull = () => {
    const t = `${this.state.repo}:${this.state.tag || 'latest'}`;
    this.setState({ pulling: true });
    docker.pull(t)
      .then(pullEvents => {
        this.pullEvents = pullEvents;

        return new Promise((resolve, reject) => {
          this.pullEvents.on('tick', () => this.setState({ layers: pullEvents.getLayers() }));
          this.pullEvents.on('end', resolve);
          this.pullEvents.on('error', reject);
        });
      })
      .catch(err => {
        console.error(err);
        toastr.error(err.message, `Failed to pull '${t}'`);
      })
      .finally(() => {
        this.getImages();
        this.setState({ layers: {}, pulling: false });
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
    docker.getImage(imageId)
      .then(image => {
        this.state.images.find(i => i.Id === imageId).loading = true;
        this.forceUpdate();

        switch (action) {
          case 'remove':
            return image.removeAsync({ force: true });
          case 'create':
            return this.props.history.push(`/containers/create/${imageId}`);
        }
      })
      .catch(err => {
        toastr.error(err.message, `Image action '${action}' failed`);
        this.getImages();
      });
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
        <table className="table table-striped filtered fade-in">
          <thead>
            <tr>
              <th>Repository</th>
              <th>Tags</th>
              <th>Virtual Size</th>
              <th>Id</th>
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
