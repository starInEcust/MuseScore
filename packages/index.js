import store from './score-store';
import renderScore from './score-typesetting/renderScore';
import actions from './score-store/actions';
import App from './score-render/App';

export default function ({
  selector, scoreData, config, callback,
}) {
  const {
    setConfig,
    getMusicScore,
  } = actions;

  if (callback) {
    callback(store);
  }

  if (config) {
    store.dispatch(setConfig(config));
  }

  if (scoreData) {
    store.dispatch(getMusicScore(scoreData));
    const musicData = store.getState().musicData;
    renderScore(musicData);
  }

  App(selector, store);
}
