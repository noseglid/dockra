import React from 'react';
import classNames from 'classnames';

export default React.createClass({
  componentDidUpdate() {
    if (this.props.scroll) {
      const el = this.refs.output;
      el.scrollTop = el.scrollHeight;
    }
  },

  render() {
    const cl = classNames({
      'no-wrap': this.props.noWrap
    });

    return (
      <pre ref="output" className={cl}>{ this.props.output }</pre>
    );
  }
});
