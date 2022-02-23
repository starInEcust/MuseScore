import React from 'react';
import Button from '@material-ui/core/Button';
import { Map } from 'immutable';
import PageSettingDialog from './components/PageSettingDialog';
// import Paper from '@material-ui/core/Paper';
import './styles/editPanel.scss';

export default class MainEditPanel extends React.Component {
  renderNormalButton(svgConfig, method) {
    const {
      id,
      size,
    } = svgConfig;

    return (
      <div className="music-edit-tools-item" key={id}>
        <Button
          classes={{
            root: 'tool-button',
          }}
          onClick={method}
        >
          <svg style={{ width: size, height: size }}>
            <use xlinkHref={`#${id}`} />
          </svg>
        </Button>
      </div>
    );
  }

  renderNoteButton(num) {
    return this.renderNormalButton({ id: `note${num}` }, () => {
      const note = Map({
        pitch: Number(num),
      });
      this.props.actions.addNote({ note });
    });
  }

  render() {
    return (
      <div className="music-edit-panel">
        <div className="music-edit-tools-bar-container">
          <div className="music-edit-tools-bar">
            <div className="music-edit-tools-line">
              <div className="music-edit-tools-group large-icon">
                {this.renderNormalButton({ id: 'undo', size: 30 }, () => {
                  this.props.actions.undo();
                })}
                {this.renderNormalButton({ id: 'redo', size: 30 }, () => {
                  this.props.actions.redo();
                })}
              </div>
              <div className="music-edit-tools-group">
                {[...Array(8).keys()].map(num => this.renderNoteButton(num))}
              </div>
              <div className="music-edit-tools-group large-icon">
                {this.renderNormalButton({ id: 'up8-icon' }, () => {})}
                {this.renderNormalButton({ id: 'down8-icon' }, () => {})}
                {this.renderNormalButton({ id: 'underline' }, () => {})}
                {this.renderNormalButton({ id: 'dot' }, () => {})}
                {this.renderNormalButton({ id: 'longLine' }, () => {})}
                {this.renderNormalButton({ id: 'sharp' }, () => {})}
                {this.renderNormalButton({ id: 'flat' }, () => {})}
                {this.renderNormalButton({ id: 'reduction' }, () => {})}
              </div>
              <div className="music-edit-tools-group large-icon">
                {this.renderNormalButton({ id: 'endBar' }, () => {})}
                {this.renderNormalButton({ id: 'returnBarStart' }, () => {})}
                {this.renderNormalButton({ id: 'returnBarEnd' }, () => {})}
                {this.renderNormalButton({ id: 'returnBarBoth' }, () => {})}
              </div>
              <div className="music-edit-tools-group">
                <div className="music-edit-tools-item">
                  <Button
                    classes={{
                      root: 'tool-button',
                    }}
                    onClick={() => {
                      this.props.actions.switchShow({ showSettings: true });
                    }}
                  >
                    <svg style={{ width: 18, height: 18 }}>
                      <use xlinkHref="#settings-icon" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <PageSettingDialog
          musicData={this.props.musicData}
          uiData={this.props.uiData}
          actions={this.props.actions}
        /> */}
      </div>
    );
  }
}
