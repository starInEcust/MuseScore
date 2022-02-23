import { NoteDurationType, Type } from 'score-config/constValue';
import { Map } from 'immutable';
import { editActions } from '../../makeActions';
import { changeNotes } from './editMethod';

export default {
  [editActions.ADD_NOTE]: (state, action) => {
    let {
      note,
    } = action.payload;
    const noteState = state.get('editState').noteState;

    const {
      partIndex,
      lineIndex,
      elementIndex,
    } = state.getIn(['params', 'cursor']);

    const notes = [];

    const cursorElement = state.getIn(['renderedScores', partIndex, lineIndex, elementIndex]);
    // 最后一个元素切是barline或第一个元素
    if (
      state.getIn(['renderedScores', partIndex, lineIndex]).size - 1 === elementIndex
      && (
        state.getIn(['renderedScores', partIndex, lineIndex]).size === 0
        || cursorElement.getIn(['originData', 'type']) === Type.BARLINE
      )
    ) {
      notes.push(Map({ type: 'BAR_START_FEATURE' }));
    } else if (
      // 中间插入，且在小结第一个插入，
      cursorElement.getIn(['originData', 'type']) === Type.BARLINE
      && state.getIn(['renderedScores', partIndex, lineIndex]).size - 1 > elementIndex
    ) {
      let thisStartFeature = null;

      for (let i = elementIndex; i < state.getIn(['renderedScores', partIndex, lineIndex]).size; i++) {
        if (state.getIn(['renderedScores', partIndex, lineIndex, i, 'originData', 'type']) === Type.BAR_START_FEATURE) {
          thisStartFeature = state.getIn(['renderedScores', partIndex, lineIndex, i]);
          // 删除当前feature
          state.updateIn(['renderedScores', partIndex, lineIndex], lineList => lineList.splice(i, 1));
          notes.push(thisStartFeature);
          break;
        }
      }
      if (!thisStartFeature) throw new Error();
    }

    console.log(213213213213, note);

    notes.push(note.merge(noteState));

    return changeNotes({ state, notes, operation: 'add' });
  },
  [editActions.ADD_BARLINE]: (state, action) => {
    const feature = action.payload || {};
    const notes = [
      Map({
        type: 'BARLINE',
        drawType: 'BARLINE',
        ...feature,
      }),
    ];
    const {
      partIndex,
      lineIndex,
      elementIndex,
    } = state.getIn(['params', 'cursor']);
    // console.log(11111, state.getIn(['renderedScores', partIndex, lineIndex]).size - 1, elementIndex);
    // TODO: 如果是不同的svgId 可以更新
    if (state.getIn(['renderedScores', partIndex, lineIndex, elementIndex, 'originData', 'type']) === Type.BARLINE) {
      return state;
    }

    if (state.getIn(['renderedScores', partIndex, lineIndex]).size - 1 > elementIndex) {
      // 在中间插入小节线

      notes.push(Map({ type: 'BAR_START_FEATURE' }));
    }

    return changeNotes({
      state,
      notes,
      operation: 'add',
    });
  },
  [editActions.DELETE_NOTE]: state => changeNotes({ state, operation: 'delete', config: { deleteNum: 1 } }),
  [editActions.BREAK_LINE]: state => changeNotes({ state, operation: 'changeFeature', feature: { breakLine: true } }),
  [editActions.CHANGE_DURATION]: (state, action) => {
    const {
      payload,
    } = action;

    let noteState = state.get('editState').noteState;
    let index = NoteDurationType.indexOf(noteState.noteDurationType);
    let newState = state;

    if (payload === '+') {
      if (index < NoteDurationType.length - 1) {
        // 配合musicxml中没有loneline = 2的情况 只有half加dot，所以这里也是加了一个dot
        // TODO:这里的转换有点问题，dot是关键字，只能转musicxml的时候给3个line的加一个half
        // noteState = noteState.set('dot', noteState.get('noteDurationType') === 'half');
        noteState = noteState.set('noteDurationType', NoteDurationType[NoteDurationType.indexOf(noteState.noteDurationType) + 1]);
        noteState = noteState.set('duration', noteState.get('duration') * 2);
        newState = newState.setIn(['editState', 'noteState'], noteState);
      }
    } else if (payload === '-') {
      if (index > 0) {
        // 配合musicxml中没有loneline = 2的情况 只有half加dot，所以这里也是加了一个dot
        // TODO:这里的转换有点问题，dot是关键字，只能转musicxml的时候给3个line的加一个half
        // noteState = noteState.set('dot', noteState.get('noteDurationType') === 'half');
        noteState = noteState.set('noteDurationType', NoteDurationType[NoteDurationType.indexOf(noteState.noteDurationType) - 1]);
        noteState = noteState.set('duration', noteState.get('duration') / 2);
        newState = newState.setIn(['editState', 'noteState'], noteState);
      }
    }

    const {
      partIndex,
      lineIndex,
      elementIndex,
    } = newState.getIn(['params', 'cursor']);

    let note = newState.getIn(['renderedScores', partIndex, lineIndex, elementIndex, 'originData']);
    let notes = [note.merge(noteState)];

    return changeNotes({
      state: newState, notes, operation: 'replace', config: { deleteNum: 1 },
    });
  },
  [editActions.CHANGE_OCTAVE]: (state, action) => {
    const {
      payload,
    } = action;

    let noteState = state.get('editState').noteState;
    let index = NoteDurationType.indexOf(noteState.noteDurationType);
    let newState = state;

    if (payload === '+') {
      noteState = noteState.set('octave', noteState.get('octave') + 1);
      newState = newState.setIn(['editState', 'noteState'], noteState);
    } else if (payload === '-') {
      if (index > 0) {
        noteState = noteState.set('octave', noteState.get('octave') - 1);
        newState = newState.setIn(['editState', 'noteState'], noteState);
      }
    }

    const {
      partIndex,
      lineIndex,
      elementIndex,
    } = newState.getIn(['params', 'cursor']);

    let note = newState.getIn(['renderedScores', partIndex, lineIndex, elementIndex, 'originData']);
    let notes = [note.merge(noteState)];

    return changeNotes({
      state: newState, notes, operation: 'replace', config: { deleteNum: 1 },
    });
  },
  [editActions.SET_HEADER]: (state, action) => state.update('header', data => data.merge(action.payload)),
};
