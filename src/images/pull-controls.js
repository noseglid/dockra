import React from 'react';
import PullStatus from './pull-status';

export default React.createClass({
  render() {
    return (
      <div>
        <form className="form-inline">
          <div className="input-group">
            <span className="input-group-btn">
              <input className="form-control" placeholder="Repository" type="text" valueLink={this.props.repo} />
            </span>
            <span className="input-group-btn">
              <input className="form-control" placeholder="Tag (default: latest)" type="text" valueLink={this.props.tag} />
            </span>
            <span className="input-group-btn">
              <button type="button" className="btn btn-primary form-control" onClick={this.props.onClick}>Pull image</button>
            </span>
          </div>
        </form>

        <PullStatus layers={this.props.layers} />
      </div>
    );
  }
});
