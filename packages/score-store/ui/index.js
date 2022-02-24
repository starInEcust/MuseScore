import { handleActions } from 'redux-actions';
import { fromJS, Map, List } from 'immutable';
import { uiActions } from '../makeActions';

// TODO: 可以不用Map
const initState = Map({
  showSettings: false,
});

export default handleActions({
  [uiActions.SWITCH_SHOW]: (state, action) => {
    const [key, value] = Object.entries(action.payload)[0];
    return state.set(key, value);
  },
}, initState);
