import React from 'react';

export default class ListFilter extends React.Component {
  render() {
    return (
      <form className="form-horizontal">
        <div className="form-group">
          <div className="col-sm-12">
            <input className="form-control" placeholder="Search" type="text" valueLink={this.props.freeText} />
          </div>
        </div>
      </form>
    );
  }
}
