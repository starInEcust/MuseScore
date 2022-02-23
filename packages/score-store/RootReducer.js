import { combineReducers } from 'redux';
import musicData from './music/musicData';
import uiData from './ui';
// import stateHistory from './stateHistory';
import { mainActions, paramsActions } from './makeActions';

let stateHistory = [];
let stateIndex = 0;
const history = reducer => (state, action) => {
  switch (action.type) {
  case mainActions.UNDO:
    if (stateHistory.length > 0) {
      stateIndex--;
      return stateHistory[stateIndex];
    }
    return reducer(state, action);
  case mainActions.REDO:
    if (stateHistory.length > 0) {
      return stateHistory[stateHistory + 1];
    }
    return reducer(state, action);
  // case 'GOTO':
  //   stateHistory.gotoState(action.stateIndex);
  //   break;
  default:
    const newState = reducer(state, action);
    if ([
      paramsActions.REFRESH_CURSOR,
    ].some(type => type === action.type)) {
      stateIndex++;
      stateHistory.push(newState);
    }
    return newState;
  }
};

export default function createReducer() {
  return history(combineReducers({
    musicData,
    uiData,
    action(state, action) { return action; },
  }));
}
