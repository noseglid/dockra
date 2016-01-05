import React from 'react';
import Select from 'react-select';
import { CubeGrid as Spinner } from '../components/spinner';
import DockerRegistry from '../lib/docker-registry';

export default React.createClass({

  getInitialState() {
    return {
      tags: []
    };
  },

  fetchTags() {
    if (!this.props.repo.value) {
      return Promise.resolve();
    }

    return DockerRegistry.listTags(this.props.repo.value)
      .map(tag => ({ value: tag.name, label: tag.name }))
      .then(tags => ({ options: tags, complete: true }))
      .catch(err => {/* Ignore this, no tags found. Showing an empty list is the best course of action here */ });
  },

  repoChanged(ev) {
    this.props.tag.requestChange('');
    this.props.repo.requestChange(ev.target.value);
  },

  tagChanged(tag) {
    this.props.tag.requestChange(tag ? tag.value : '');
  },

  render() {
    return (
      <div className="row">
        <div className="col-md-4">
          <input
            value={this.props.repo.value}
            onChange={this.repoChanged}
            className="form-control"
            disabled={this.props.pulling}
            placeholder="Repository"
            type="text"
            />
        </div>
        <div className="col-md-4">
          <Select.Async
            key={this.props.repo.value}
            value={this.props.tag.value}
            disabled={this.props.pulling}
            onChange={this.tagChanged}
            loadOptions={this.fetchTags}
            placeholder="Select tag..." />
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-primary form-control"
            disabled={this.props.pulling || !this.props.repo.value || !this.props.tag.value}
            type="button"
            onClick={this.props.onClick}>
              Pull image
          </button>
        </div>
        <div className="col-md-2">
          { this.props.pulling ? <Spinner size="28px" fadeIn /> : '' }
        </div>
      </div>
    );
  }
});
