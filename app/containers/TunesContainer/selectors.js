import { createSelector } from 'reselect';
import { initialState } from './reducer';
import get from 'lodash/get';

/**
 * Direct selector to the tunesContainer state domain
 */

const selectTunesContainerDomain = (state) => state.tunesContainer || initialState;

const selectTunesContainer = () => createSelector(selectTunesContainerDomain, (substate) => substate);

export const selectTunesSongs = () => createSelector(selectTunesContainerDomain, (substate) => get(substate, 'songs'));
export const selectTunesError = () =>
  createSelector(selectTunesContainerDomain, (substate) => get(substate, 'tunesError'));
export const selectTunesArtist = () =>
  createSelector(selectTunesContainerDomain, (substate) => get(substate, 'artistName'));

export default selectTunesContainer;
export { selectTunesContainerDomain };
