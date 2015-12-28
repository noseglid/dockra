import React from 'react';
import PullStatus from './pull-status';
import { FoldingCube } from '../components/spinner';

export default React.createClass({
  render() {
    return (
      <div>
        <form className="form-inline">
          <div className="input-group">
            <span className="input-group-btn">
              <input className="form-control" disabled={this.props.pulling} placeholder="Repository" type="text" valueLink={this.props.repo} />
            </span>
            <span className="input-group-btn">
              <input className="form-control" disabled={this.props.pulling} placeholder="Tag (default: latest)" type="text" valueLink={this.props.tag} />
            </span>
            <span className="input-group-btn">
              <button className="btn btn-primary form-control" disabled={this.props.pulling} type="button" onClick={this.props.onClick}>Pull image</button>
            </span>
            { this.props.pulling ? <FoldingCube fadeIn /> : '' }
          </div>
        </form>

        <PullStatus layers={this.props.layers} />
      </div>
    );
  }
});
