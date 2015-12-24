import React from 'react';
import classNames from 'classnames';

export default React.createClass({
  render() {
    const iconClass = classNames('glyphicon', {
      [ `glyphicon-${this.props.icon}` ]: true
    });
    const cb = () => {
      this.props.callback.apply(null, [ this.props.action].concat(this.props.callbackArgs));
    };
    return (
      <button type="button" className="btn btn-default btn-xs" onClick={cb}>
        <span className={iconClass}></span>
      </button>
    );
  }
});
