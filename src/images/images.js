import React from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import humane from 'humane-js';
import ListFilter from '../components/list-filter';
import Image from './image';
import { IntlMixin, FormattedMessage } from 'react-intl';
import { listImages, getImage } from '../lib/docker';

export default React.createClass({
  mixins: [ IntlMixin, LinkedStateMixin ],

  getInitialState() {
    return {
      images: []
    };
  },

  getImages() {
    listImages()
      .map(image => Object.assign({}, image, getImage(image.Id)))
      .then(images => images.sort((lhs, rhs) => lhs.Id.localeCompare(rhs.Id)))
      .then(images => this.setState({ images: images }))
      .catch(err => {
        console.error(err);
        humane.error(err.message);
      });
  },

  componentDidMount() {
    this.getImages();
  },

  imageFilter(image) {
    const f = this.state.nameFilter;

    if (!f || // No filter - include all
        image.repo.indexOf(f) !== -1 || // Repo contains filter
        image.tag.indexOf(f) !== -1) { // Tag contains filter
      return true;
    }

    return false;
  },

  doAction(action, imageId) {
    const image = getImage(imageId);
    let promise;
    switch (action) {
      case 'remove':
        promise = image.removeAsync()
          .then(() => humane.success(`Image successfully removed.`))
          .then(() => this.getImages());
        break;
    }
    this.state.images.find(i => i.Id === imageId).loading = true;
    this.forceUpdate();

    promise.catch(err => humane.error(`Failed to ${action} container: ${err.message}`));
  },

  render() {
    const rows = [].concat.apply([], this.state.images.map(image => image.RepoTags.map(repoTag => ({
      repo: repoTag.split(':')[0],
      tag: repoTag.split(':')[1],
      virtualSize: image.VirtualSize,
      id: image.Id
    }))));
    const filteredImages = rows.filter(this.imageFilter);
    return (
      <div id="images" className="container">
        <h1>Images <small><FormattedMessage message={this.getIntlMessage('images.filtered')} num={filteredImages.length} /></small></h1>
        <ListFilter freeText={this.linkState('nameFilter')} />
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
});
