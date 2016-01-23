import React from 'react';
import classNames from 'classnames';

class ControlButton extends React.Component {
  render() {
    const iconClass = classNames('glyphicon', {
      [ `glyphicon-${this.props.icon}` ]: true
    });
    const cb = () => {
      this.props.callback.apply(null, [ this.props.action].concat(this.props.callbackArgs));
    };
    return (
      <button type="button"
              className="btn btn-default btn-xs"
              onClick={cb}
              disabled={this.props.disabled}>
        <span className={iconClass}></span>
      </button>
    );
  }
}

ControlButton.propTypes = {
  callback: React.PropTypes.func,
  icon: React.PropTypes.string,
  disabled: React.PropTypes.bool
};

export default ControlButton;
