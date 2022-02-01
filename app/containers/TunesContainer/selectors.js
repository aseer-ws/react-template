import { createSelector } from 'reselect';
import { initialState } from './reducer';
import get from 'lodash/get';

/**
 * Direct selector to the tunesContainer state domain
 */

const selectTunesContainerDomain = (state) => state.tunesContainer || initialState;

const makeSelectTunesContainer = () => createSelector(selectTunesContainerDomain, (substate) => substate);

export const selectTunesSongs = () =>
  createSelector(selectTunesContainerDomain, (substate) => get(substate, 'songsData'));
export const selectTunesError = () => createSelector(selectTunesContainerDomain, (substate) => get(substate, 'error'));
export const selectTunesArtist = () =>
  createSelector(selectTunesContainerDomain, (substate) => get(substate, 'artist'));

export default makeSelectTunesContainer;
export { selectTunesContainerDomain };
