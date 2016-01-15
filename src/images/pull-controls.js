import React from 'react';
import Select from 'react-select';
import { CubeGrid as Spinner } from '../components/spinner';
import DockerRegistry from '../lib/docker-registry';
import docker from '../lib/docker';

export default React.createClass({

  fetchRepos(query) {
    if (!query && !this.props.repo.value) {
      return Promise.resolve();
    } else if (!query) {
      return Promise.resolve({ options: [ { value: this.props.repo.value, label: this.props.repo.value } ] });
    }

    return docker.searchImages(query)
      .then(result => result
        .sort((lhs, rhs) => rhs.star_count - lhs.star_count)
        .map(repo => ({ value: repo.name, label: `${repo.name} (\u2605${repo.star_count})` }))
      )
      .then(repos => ({ options: repos }))
      .catch(err => {/* Ignore this, no repos found. Showing an empty list is the best course of action here */ });
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

  repoChanged(repo) {
    this.props.repo.requestChange(repo ? repo.value : '');
    this.props.tag.requestChange('');
  },

  tagChanged(tag) {
    this.props.tag.requestChange(tag ? tag.value : '');
  },

  render() {
    return (
      <div className="row">
        <div className="col-sm-4">
          <Select.Async
            key={Math.random().toString()}
            value={this.props.repo.value}
            onChange={this.repoChanged}
            disabled={this.props.pulling}
            loadOptions={this.fetchRepos}
            placeholder="Repository..."
            />
        </div>
        <div className="col-sm-4">
          <Select.Async
            key={this.props.repo.value}
            value={this.props.tag.value}
            disabled={this.props.pulling}
            onChange={this.tagChanged}
            loadOptions={this.fetchTags}
            placeholder="Select tag..."
            />
        </div>
        <div className="col-sm-2">
          <button
            className="btn btn-primary form-control"
            disabled={this.props.pulling || !this.props.repo.value || !this.props.tag.value}
            type="button"
            onClick={this.props.onClick}>Pull image</button>
        </div>
        <div className="col-sm-2">
          { this.props.pulling ? <Spinner size="28px" fadeIn /> : '' }
        </div>
      </div>
    );
  }
});
