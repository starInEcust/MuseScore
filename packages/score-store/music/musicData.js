import { handleActions } from 'redux-actions';
import { fromJS, Map, List } from 'immutable';
import { Mode } from 'score-config/constValue';
import { mainActions, editActions } from '../makeActions';
import styles from './record/initStyles';
import params from './record/elementsParams';
import editState from './record/editState';
import handleEdit from './handleEdit';
import handleSetParams from './handleSetParams';

// TODO: 可以不用Map
const initState = Map({
  config: {},
  musicScores: [],
  header: Map({
    title: '啊啊啊啊啊啊',
    subtitle: '第三方第三方',
    subtitle2: '的解放路都市客积分',
    wordAuthor: 'pomoho',
    songAuthor: '泼墨',
    speed: '120',
    emotion: 'fky',
    key: '',
    beats: '',
  }),
  keyAndMeter: {
    text: '1=F',
    beatType: 4,
    beats: 4,
    divisions: 4,
  },
  renderedScores: List([
    List([
      List([
        // Map({
        //   type: 'BAR_START_FEATURE',
        // }),
      ]),
    ]),
  ]),
  styles,
  params,
  editState,
});

export default handleActions({
  [mainActions.SET_CONFIG]: (state, action) => state.set('config', action.payload),
  [mainActions.GET_MUSIC_SCORE]: (state, action) => {
    const {
      musicScores,
      keyAndMeter,
      header,
    } = action.payload;
    let mode;

    if (musicScores.length > 1) {
      mode = Mode.MULTI;
    } else {
      mode = Mode.SINGLE;
    }

    return state
      .update('config', config => ({ ...config, mode }))
      .set('musicScores', fromJS(musicScores))
      .set('keyAndMeter',  Map(keyAndMeter))
      .set('header', Map(header));
  },
  [mainActions.RENDERED_SCORE]: (state, action) => {
    const { payload } = action;
    return state.set('renderedScores', payload);
  },
  ...handleEdit,
  ...handleSetParams,
}, initState);
