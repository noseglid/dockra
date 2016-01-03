import React from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import update from 'react-addons-update';
import NestLinkedStateMixin from 'react-nest-link-state';
import format from '../../lib/format';
import docker from '../../lib/docker';
import humane from 'humane-js';

export default React.createClass({
  mixins: [ LinkedStateMixin, NestLinkedStateMixin ],

  getInitialState() {
    return {
      container: {
        Env: [],
        Tty: false,
        Image: this.props.params.imageId
      }
    };
  },

  componentDidMount() {
    docker.getImage(this.state.container.Image).inspectAsync()
      .then(i => {
        const repoTag = i.RepoTags.find(t => !t.match(/[0-9a-f]{64}/));
        if (!repoTag) return;

        this.setState({
          container: update(this.state.container, { Image: { $set: repoTag } })
        });
      });
  },

  removeEnv(index) {
    const container = this.state.container;
    container.Env.splice(index, 1);
    this.setState({ container: container });
  },

  addEnv() {
    const container = this.state.container;
    container.Env = container.Env.concat('');
    this.setState({ container: container });
  },

  createContainer() {
    const createOpts = update(this.state.container, {
      Cmd: { $set: this.state.container.Cmd.split(' ') }
    });
    docker.createContainer(createOpts)
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
        <h1>Create container from <code>{this.state.container.Image}</code></h1>
        <form className="form-horizontal">

          <div className="form-group">
            <label htmlFor="input-name" className="col-sm-2 control-label">Name</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="input-name" valueLink={this.nestLinkedState([ 'container', 'name' ])} placeholder="Container name (default: <generated>)" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="input-hostname" className="col-sm-2 control-label">Hostname</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="input-hostname" valueLink={this.nestLinkedState([ 'container', 'Hostname' ])} placeholder="Container hostname (default: container id)" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="input-cmd" className="col-sm-2 control-label">Command</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="input-cmd" valueLink={this.nestLinkedState([ 'container', 'Cmd' ])} placeholder="Command to run" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="input-wd" className="col-sm-2 control-label">Working dir</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="input-wd" valueLink={this.nestLinkedState([ 'container', 'WorkingDir' ])} placeholder="Working directory for command" />
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
            this.state.container.Env.map((entry, index) => {
              return (
                <div key={index} className="form-group">
                  <label htmlFor="input-env-{$index}" className="col-sm-2 control-label">Environment</label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" id="input-env-${index}" valueLink={this.nestLinkedState(['container', 'Env', index])} placeholder="KEY=VALUE" />
                  </div>
                  <div className="col-sm-1">
                    <button className="form-control btn btn-default btn-xs" onClick={this.removeEnv.bind(this, index)}>
                      <span className="glyphicon glyphicon-trash"></span>
                    </button>
                  </div>
                </div>
              );
            })
          }
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-3">
              <button className="form-control btn btn-default btn-xs" onClick={this.addEnv}>
                <span className="glyphicon glyphicon-plus"></span> Add environment
              </button>
            </div>
          </div>

          <hr />
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
