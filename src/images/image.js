import React from 'react';

export default React.createClass({
  render() {
    return (
      <tr>
        <td>{this.props.repo}</td>
        <td>{this.props.tag}</td>
        <td title={this.props.id}>{this.props.id}</td>
        <td></td>
      </tr>
    );
  }
});
