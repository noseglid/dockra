import React from 'react';

export default React.createClass({
  render() {
    return (
      <div id="logs-modal" className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">Logs for { this.props.name }</h4>
            </div>
            <div className="modal-body">
              <pre>{ this.props.logs }</pre>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
