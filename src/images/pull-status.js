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
          let percentDownload;
          let percentExtract;
          switch (layer.ev.status) {
            case 'Downloading':
              percentExtract = 0;
              percentDownload = Math.round(100 * layer.ev.progressDetail.current / layer.ev.progressDetail.total);
              if (isNaN(percentDownload)) {
                percentDownload = [ 'Pull complete', 'Download complete' ].indexOf(layer.ev.status) === -1 ? 0 : 100;
              }
              break;

            case 'Extracting':
              percentDownload = 100;
              percentExtract = Math.round(100 * layer.ev.progressDetail.current / layer.ev.progressDetail.total);
              if (isNaN(percentExtract)) {
                percentExtract = [ 'Pull complete', 'Download complete' ].indexOf(layer.ev.status) === -1 ? 0 : 0;
              }
              break;

            default:
              percentDownload = [ 'Pull complete', 'Download complete' ].indexOf(layer.ev.status) === -1 ? 0 : 100;
              percentExtract = 'Pull complete' === layer.ev.status ? 100 : 0;
          }

          const clDownload = classNames('progress-bar', 'progress-bar-warning', {
            'progress-bar-striped': percentDownload < 100,
            'active': 0 < percentDownload && percentDownload < 100
          });
          const clExtract = classNames('progress-bar', 'progress-bar-success', {
            'progress-bar-striped': percentExtract < 100,
            'active': 0 < percentExtract && percentExtract < 100
          });
          return (
            <div className="row" key={key}>
              <div className="col-sm-3">{layer.ev.status}</div>
              <div className="col-sm-2">{layer.speed.bytesPerSecond ? `${filesize(layer.speed.bytesPerSecond)} / s` : '-'}</div>
              <div className="col-sm-7">
                <div className="progress">
                  <div className={clDownload}
                       aria-valuenow={percentDownload}
                       aria-valuemin="0"
                       aria-valuemax="100"
                       role="progressbar"
                       style={ { width: `${Math.round(percentDownload / 2)}%`, minWidth: '3em' } }>
                    {percentDownload}%
                  </div>
                  <div className={clExtract}
                       aria-valuenow={percentExtract}
                       aria-valuemin="0"
                       aria-valuemax="100"
                       role="progressbar"
                       style={ { width: `${Math.round(percentExtract / 2)}%`, minWidth: '3em' } }>
                    {percentExtract}%
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
