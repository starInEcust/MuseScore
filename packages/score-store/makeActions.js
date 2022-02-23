import { createAction } from 'redux-actions';

export function makeSyncActions(actionNameArray, groupName = 'MAIN') {
  const type = {};
  const actions = {};
  actionNameArray.forEach((name) => {
    let key = '';
    Array.from(name).forEach((word) => {
      if (/[A-Z]/.test(word)) {
        key += `_${word}`;
      } else {
        key += word.toUpperCase();
      }
    });
    type[key] = `${groupName.toUpperCase()}_${key}`;
    actions[name] = createAction(type[key]);
  });

  return {
    ...type,
    actions,
  };
}

export const mainActions = makeSyncActions([
  // 'init',
  'undo',
  'redo',
  'getMusicScore',
  'setConfig',
  'renderedScore',
]);

export const editActions = makeSyncActions([
  'addNote',
  'deleteNote',
  'changeDuration',
  'changeOctave',
  'breakLine',
  'addBarline',
  'setHeader',
], 'edit');


export const paramsActions = makeSyncActions([
  'changePosition',
  'setLine',
  'setCursor',
  'refreshCursor',
  'setStyle',
], 'params');

export const uiActions = makeSyncActions([
  'switchShow',
], 'params');
