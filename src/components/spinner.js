import React from 'react';
import classNames from 'classnames';

class CubeGrid extends React.Component {
  render() {
    const cl = classNames('spinner', 'sk-cube-grid', {
      'fade-in': this.props.fadeIn
    });
    const style = {
      width: `${this.props.size}` || 'auto',
      height: `${this.props.size}` || 'auto'
    };
    return (
      <div className={cl} style={style}>
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
}

class FoldingCube extends React.Component {
  render() {
    const cl = classNames('spinner', 'sk-folding-cube', {
      'fade-in': this.props.fadeIn
    });
    const style = {
      width: `${this.props.size}` || 'auto',
      height: `${this.props.size}` || 'auto'
    };
    return (
      <div className={cl} style={style}>
        <div className="sk-cube1 sk-cube"></div>
        <div className="sk-cube2 sk-cube"></div>
        <div className="sk-cube4 sk-cube"></div>
        <div className="sk-cube3 sk-cube"></div>
      </div>
    );
  }
}

export { FoldingCube, CubeGrid };
