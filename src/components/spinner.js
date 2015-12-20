import React from 'react';
import classNames from 'classnames';

const CubeGrid = React.createClass({
  render() {
    const cl = classNames('sk-cube-grid', {
      'fade-in': this.props.fadeIn
    });
    return (
      <div className={cl}>
        <div className="sk-cube sk-cube1"></div>
        <div className="sk-cube sk-cube2"></div>
        <div className="sk-cube sk-cube3"></div>
        <div className="sk-cube sk-cube4"></div>
        <div className="sk-cube sk-cube5"></div>
        <div className="sk-cube sk-cube6"></div>
        <div className="sk-cube sk-cube7"></div>
        <div className="sk-cube sk-cube8"></div>
        <div className="sk-cube sk-cube9"></div>
      </div>
    );
  }
});

const FoldingCube = React.createClass({
  render() {
    const cl = classNames('sk-folding-cube', {
      'fade-in': this.props.fadeIn
    });
    return (
      <div className={cl}>
        <div className="sk-cube1 sk-cube"></div>
        <div className="sk-cube2 sk-cube"></div>
        <div className="sk-cube4 sk-cube"></div>
        <div className="sk-cube3 sk-cube"></div>
      </div>
    );
  }
});

export { FoldingCube, CubeGrid };
