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

  render() {
    const rows = [].concat.apply([], this.state.images.map(image => image.RepoTags.map(repoTag => ({
      repo: repoTag.split(':')[0],
      tag: repoTag.split(':')[1],
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
              <th>Id</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            { filteredImages.map(image => <Image doAction={this.doAction} key={`${image.repo}-${image.tag}`} {...image} />) }
          </tbody>
        </table>
      </div>
    );
  }
});
