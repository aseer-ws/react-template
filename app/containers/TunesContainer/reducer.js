/*
 *
 * TunesContainer reducer
 *
 */
import produce from 'immer';
import { createActions } from 'reduxsauce';

export const initialState = {
  artistName: '',
  songs: {},
  tunesError: null
};

export const { Types: tunesContainerTypes, Creators: tunesContainerCreators } = createActions({
  requestGetSongs: ['artistName'],
  successGetSongs: ['data'],
  failureGetSongs: ['error'],
  clearSongs: {}
});

export const tunesContainerReducer = produce((state = initialState, action) => {
  switch (action.type) {
    case tunesContainerTypes.REQUEST_GET_SONGS:
      state.artistName = action.artistName;
      break;
    case tunesContainerTypes.SUCCESS_GET_SONGS:
      state.tunesError = null;
      state.songs = action.data;
      break;
    case tunesContainerTypes.FAILURE_GET_SONGS:
      state.songs = {};
      state.tunesError = action.error;
      break;
    case tunesContainerTypes.CLEAR_SONGS:
      state.songs = {};
      state.artistName = '';
      break;
    default:
      return state;
  }
});

export default tunesContainerReducer;
