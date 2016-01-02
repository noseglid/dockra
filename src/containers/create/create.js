import React from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import NestLinkedStateMixin from 'react-nest-link-state';
import format from '../../lib/format';
import docker from '../../lib/docker';
import humane from 'humane-js';

export default React.createClass({
  mixins: [ LinkedStateMixin, NestLinkedStateMixin ],

  getInitialState() {
    return {
      image: docker.getImage(this.props.params.imageId),
      imageName: format.hash(this.props.params.imageId),
      env: ['KEY1=VALUE1', 'KEY2=VALUE2']
    };
  },

  componentDidMount() {
    this.state.image.inspectAsync()
      .then(i => {
        const repoTag = i.RepoTags.find(t => !t.match(/[0-9a-f]{64}/));
        if (!repoTag) return;
        this.setState({ imageName: repoTag });
      });
  },

  createContainer() {
    const opts = {
      name: this.state.name,
      Cmd: this.state.cmd.split(' '),
      Image: this.state.imageName,
      Hostname: this.state.hostname,
      Tty: false,
      Env: this.state.env
    };
    docker.createContainer(opts)
      .then(container => {
        let promise = Promise.resolve();
        if (this.state.startOnCreated) {
          promise = docker.getContainer(container.id).startAsync();
        }
        return promise.then(() => docker.getContainer(container.id).inspectAsync());
      })
      .then(containerInfo => {
        humane.success(`'${format.containerName(containerInfo.Name)}' successfully created${this.state.startOnCreated ? ' and started' : ''}.`);
      })
      .catch(err => {
        humane.error(err.message);
        console.error(err);
      });
  },

  render() {
    return (
      <div className="container">
        <h1>Create container from <code>{this.state.imageName}</code></h1>
        <form className="form-horizontal">

          <div className="form-group">
            <label htmlFor="input-name" className="col-sm-2 control-label">Name</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="input-name" valueLink={this.linkState('name')} placeholder="Container name (default: <generated>)" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="input-hostname" className="col-sm-2 control-label">Hostname</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="input-hostname" valueLink={this.linkState('hostname')} placeholder="Container hostname (default: container id)" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="input-cmd" className="col-sm-2 control-label">Command</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="input-cmd" valueLink={this.linkState('cmd')} placeholder="Command to run" />
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <div className="checkbox">
                <label><input type="checkbox" checkedLink={this.linkState('startOnCreated')} /> Start container when created</label>
              </div>
            </div>
          </div>

          {
            this.state.env.map((entry, index) => {
              return (
                <div key={index} className="form-group">
                  <label htmlFor="input-cmd" className="col-sm-2 control-label">Environment</label>
                  <div className="col-sm-10">
                    <input type="text" className="form-control" id="input-cmd" valueLink={this.nestLinkedState(['env', index])} placeholder="KEY=VALUE" />
                  </div>
                </div>
              );
            })
          }

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-primary" onClick={this.createContainer}>Create</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
});
