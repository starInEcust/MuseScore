import { List, Map } from 'immutable';
import { Type } from 'score-config/constValue';
import { paramsActions } from '../../makeActions';
import { paramsItemRecord } from '../record/elementsParams';

export default {
  [paramsActions.SET_LINE]: (state, action) => {
    const {
      partIndex,
      lineIndex,
      x,
      y,
    } = action.payload;

    if (
      state.get('params').scoreLine
      && state.getIn(['params', 'scoreLine', partIndex, lineIndex])
      && state.getIn(['params', 'scoreLine', partIndex, lineIndex]).x === x
      && state.getIn(['params', 'scoreLine', partIndex, lineIndex]).y === y
    ) {
      return state;
    }

    let newState = state;

    if (!state.getIn(['params', 'scoreLine', partIndex])) {
      newState = state.setIn(['params', 'scoreLine', partIndex], List());
    }

    newState = newState.setIn(['params', 'scoreLine', partIndex, lineIndex], new paramsItemRecord({
      x,
      y,
    }));

    return newState;
  },
  [paramsActions.REFRESH_CURSOR]: (state, action) => {
    const {
      partIndex,
    } = action.payload;

    const cursorData = state.getIn(['params', 'cursor']);
    // 更新当前段落
    if (partIndex === cursorData.get('partIndex')) {
      // 没有元素 TODO: 多行模式没有元素好像不对
      if (state.getIn(['renderedScores', partIndex]).size === 0) {
        return state.updateIn(['params', 'cursor'], data => data.merge(Map({
          x: 0,
          y: state.getIn(['styles', 'firstLineOffsetTop']),
        })));
      }
      const presentElement = state.getIn([
        'renderedScores',
        cursorData.get('partIndex'),
        cursorData.get('lineIndex'),
        cursorData.get('elementIndex'),
      ]);

      const {
        x: svgX,
        width,
      } = presentElement.get('svgData');

      const {
        paddingHorizontal,
        firstLineOffsetTop,
      } = state.get('styles');

      const y = state.getIn(['params', 'scoreLine', partIndex, cursorData.get('lineIndex'), 'y']);

      return state.updateIn(['params', 'cursor'], data => data.merge(Map({
        x: svgX + width + paddingHorizontal,
        y: y + firstLineOffsetTop,
      })));
    }
    return state;
  },
  [paramsActions.SET_CURSOR]: (state, action) => {
    const {
      x,
      y,
      partIndex,
      lineIndex,
      elementIndex,
    } = action.payload;
    /*
      partIndex,
      lineIndex,
      elementIndex
      不参与渲染，方便后面获取当前光标位置
    */
    let newState = state.updateIn(['params', 'cursor'], cursorData => cursorData.merge(Map({
      x,
      y,
      partIndex,
      lineIndex,
      elementIndex,
    })));

    const cursorNote = newState.getIn(['renderedScores', partIndex, lineIndex, elementIndex]);

    if (cursorNote.getIn(['originData', 'type']) === Type.NOTE) {
      newState = newState.updateIn(['editState', 'noteState'], noteState => noteState.merge(Map({
        octave: cursorNote.getIn(['originData', 'octave']),
        noteDurationType: cursorNote.getIn(['originData', 'noteDurationType']),
        duration: cursorNote.getIn(['originData', 'duration']),
        dot: cursorNote.getIn(['originData', 'dot']),
      })));
    }
    return newState;
  },
  [paramsActions.SET_STYLE]: (state, action) => {
    const [value, ...keyArray] = action.payload;
    return state.setIn(['styles', ...keyArray], value);
  },
};
