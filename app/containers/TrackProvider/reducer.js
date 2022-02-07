/*
 *
 * TrackProvider reducer
 *
 */
import produce from 'immer';
import { createActions } from 'reduxsauce';

export const initialState = {
  list: { artistName: '', tracks: [], trackCount: 0, error: null },
  details: {
    trackId: null,
    track: {},
    error: null
  }
};

export const { Types: trackProviderTypes, Creators: trackProviderCreators } = createActions({
  requestGetTracks: ['artistName'],
  successGetTracks: ['data'],
  failureGetTracks: ['error'],
  clearTracks: {},
  requestGetTrack: ['trackId'],
  successGetTrack: ['data'],
  failureGetTrack: ['error']
});

/* eslint-disable default-case, no-param-reassign */
export const trackProviderReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case trackProviderTypes.REQUEST_GET_TRACKS:
        draft.list.artistName = action.artistName;
        break;
      case trackProviderTypes.SUCCESS_GET_TRACKS:
        draft.list.tracks = action.data.results;
        draft.list.trackCount = action.data.resultCount;
        draft.list.error = null;
        break;
      case trackProviderTypes.FAILURE_GET_TRACKS:
        draft.list.tracks = [];
        draft.list.trackCount = 0;
        draft.list.error = action.error;
        break;
      case trackProviderTypes.CLEAR_TRACKS:
        draft.list.tracks = [];
        draft.list.trackCount = 0;
        draft.list.error = null;
        break;
      case trackProviderTypes.REQUEST_GET_TRACK:
        draft.details.trackId = action.trackId;
        break;
      case trackProviderTypes.SUCCESS_GET_TRACK:
        draft.details.track = action.data;
        draft.details.error = null;
        break;
      case trackProviderTypes.FAILURE_GET_TRACK:
        draft.details.track = {};
        draft.details.error = action.error;
        break;
      default:
        return state;
    }
  });

export default trackProviderReducer;
