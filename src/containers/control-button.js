import React from 'react';
import classNames from 'classnames';

export default React.createClass({
  onClick() {
    this.props.onClick(this.props.containerId, this.props.action);
  },

  render() {
    const iconClass = classNames('glyphicon', {
      [ `glyphicon-${this.props.icon}` ]: true
    });
    return (
      <button type="button" className="btn btn-default btn-xs" onClick={this.onClick}>
        <span className={iconClass}></span>
      </button>
    );
  }
});
