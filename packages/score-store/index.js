import { createStore, applyMiddleware, compose } from 'redux';
import loggerMiddleware from 'redux-logger';
import createReducer from './RootReducer';

const enhancer = compose(
  applyMiddleware(
    loggerMiddleware(),
  ),
);

export function configureStore(initialState) {
  return createStore(createReducer(), initialState, enhancer);
}

const store = configureStore();

export default store;
