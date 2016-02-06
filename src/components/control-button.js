import React from 'react';
import classNames from 'classnames';

class ControlButton extends React.Component {
  render() {
    const iconClass = classNames('fa', {
      [ `fa-${this.props.icon}` ]: true,
      'fa-spin': this.props.spin
    });
    const cb = () => {
      this.props.callback.apply(null, [ this.props.action].concat(this.props.callbackArgs));
    };
    return (
      <button type="button"
              className="control-button btn btn-default btn-xs"
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
