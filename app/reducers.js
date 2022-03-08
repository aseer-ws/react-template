/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';

import languageProviderReducer from 'containers/LanguageProvider/reducer';
import homeContainerReducer from 'containers/HomeContainer/reducer';
import trackProviderReducer from './containers/TrackProvider/reducer';
import trackFormContainerReducer from './containers/TrackFormContainer/reducer';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer(injectedReducer = {}) {
  const rootReducer = combineReducers({
    ...injectedReducer,
    language: languageProviderReducer,
    homeContainer: homeContainerReducer,
    trackProvider: trackProviderReducer,
    trackFormContainer: trackFormContainerReducer
  });

  return rootReducer;
}
