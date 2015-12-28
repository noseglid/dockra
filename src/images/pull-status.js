import React from 'react';
import classNames from 'classnames';
import filesize from 'filesize';

export default React.createClass({
  render() {
    return (
      <div>
        { Object.keys(this.props.layers).length > 0 ? <hr /> : '' }
        {
        Object.keys(this.props.layers).map(key => {
          const layer = this.props.layers[key];
          let percent = Math.round(100 * layer.ev.progressDetail.current / layer.ev.progressDetail.total);
          if (isNaN(percent)) {
            percent = [ 'Pull complete', 'Download complete' ].indexOf(layer.ev.status) === -1 ? 0 : 100;
          }
          const style = {
            width: `${percent}%`
          };
          const cl = classNames('progress-bar', {
            'progress-bar-striped': percent < 100,
            'active': percent < 100
          });
          return (
            <div className="row" key={key}>
              <div className="col-sm-2">{layer.ev.status}</div>
              <div className="col-sm-2">{layer.speed.bytesPerSecond ? `${filesize(layer.speed.bytesPerSecond)} / s` : '-'}</div>
              <div className="col-sm-8">
                <div className="progress">
                  <div className={cl}
                       aria-valuenow={percent}
                       aria-valuemin="0"
                       aria-valuemax="100"
                       role="progressbar"
                       style={style}>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      }
      </div>
    );
  }
});
