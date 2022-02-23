import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from 'score-store/actions';
import edit from 'score-operation';
import Stage from './reactRender/Stage';
// import EditPanel from './editPanel';
import './styles/app.scss';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.stage = React.createRef();
  }

  componentDidMount() {
    edit(this.stage.current, this.props.actions);
  }

  render() {
    return (
      <div className="music-score-container">
        {/* <EditPanel
          musicData={this.props.musicData}
          uiData={this.props.uiData}
          actions={this.props.actions}
        /> */}
        <div className="stage-container">
          <div className="stage-wrap">
            <Stage
              ref={this.stage}
              musicData={this.props.musicData}
              actions={this.props.actions}
            />
          </div>
        </div>
      </div>
    );
  }
}

const ConnectedApp = connect(
  state => ({
    musicData: state.musicData,
    uiData: state.uiData,
  }),
  dispatch => ({
    actions: bindActionCreators(Object.assign({}, actions), dispatch),
  }),
)(App);

export default function (id, store) {
  console.log(id);
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedApp />
    </Provider>,
    document.querySelector(id),
  );
}
