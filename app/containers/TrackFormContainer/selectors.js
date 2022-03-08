import { get } from 'lodash';
import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectTrackFormContainerDomain = (state) => state.trackFormContainer || initialState;

const selectFormValues = () =>
  createSelector(selectTrackFormContainerDomain, (substate) => get(substate, 'formValues'));

export { selectTrackFormContainerDomain, selectFormValues };
