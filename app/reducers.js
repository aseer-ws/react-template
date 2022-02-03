/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import immutableTransform from 'redux-persist-transform-immutable';
import storage from 'redux-persist/lib/storage';
import history from 'utils/history';
import languageProviderReducer from 'containers/LanguageProvider/reducer';
import { persistReducer } from 'redux-persist';
// import homeContainerReducer from 'containers/HomeContainer/reducer';
// import tunesContainerReducer from 'containers/TunesContainer/reducer';

// redux persit configuration
const persistConfig = {
  version: 1,
  transforms: [immutableTransform()],
  key: 'root',
  blacklist: ['router'],
  storage
};

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer(injectedReducer = {}) {
  const rootReducer = combineReducers({
    ...injectedReducer,
    language: languageProviderReducer,
    router: connectRouter(history)
    // homeContainer: homeContainerReducer,
    // tunesContainer: tunesContainerReducer
  });
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  return persistedReducer;
}
