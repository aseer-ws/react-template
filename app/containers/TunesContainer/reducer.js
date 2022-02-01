/*
 *
 * TunesContainer reducer
 *
 */
import produce from 'immer';
// import { fromJS } from 'immutable';
import { createActions } from 'reduxsauce';

export const initialState = {
  artist: '',
  songsData: {},
  tunesError: null
};

export const { Types: tunesContainerTypes, Creators: tunesContainerCreators } = createActions({
  setArtist: ['artistName'],
  setSongsData: ['songsData'],
  setTunesError: ['error'],
  clearSongs: {}
});

/* eslint-disable default-case, no-param-reassign */
export const tunesContainerReducer = produce((state = initialState, action) => {
  switch (action.type) {
    case tunesContainerTypes.SET_ARTIST:
      state.artist = action.artistName;
      break;
    case tunesContainerTypes.SET_SONGS_DATA:
      state.tunesError = null;
      state.songsData = action.songsData;
      break;
    case tunesContainerTypes.SET_TUNES_ERROR:
      state.songsData = {};
      state.tunesError = action.error;
      break;
    case tunesContainerTypes.CLEAR_SONGS:
      state.songsData = {};
      state.artist = '';
      break;
    default:
      return state;
  }
});

export default tunesContainerReducer;
