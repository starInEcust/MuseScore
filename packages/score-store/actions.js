import {
  mainActions, editActions, paramsActions, uiActions,
} from './makeActions';

export default {
  ...mainActions.actions,
  ...editActions.actions,
  ...paramsActions.actions,
  ...uiActions.actions,
};
