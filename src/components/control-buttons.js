import React from 'react';
import ControlButton from './control-button';

export default class ControlButtons extends React.Component {
  render() {
    return (
      <fieldset disabled={this.props.disabled}>
          {
            this.props.buttons(this.props.action).map((row, i) => {
              return (<div className="btn-group" key={i}>
                {
                  row.map((c, j) => {
                    return <ControlButton key={`${i}-${j}`} {...c}
                                          disabled={this.props.disabled}
                                          callback={this.props.callback}
                                          callbackArgs={this.props.callbackArgs} />;
                  })
                }
              </div>);
            })
          }
      </fieldset>
    );
  }
}
