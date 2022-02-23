import React from 'react';
import CloseIcon from '@material-ui/icons/close';

class BottomDrawer extends React.Component {
  render() {
    return (
      <div>
        <div className="close-button">
          <CloseIcon />
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default BottomDrawer;
