// import produce from 'immer'
import { trackProviderReducer, trackProviderTypes, initialState } from '../reducer';

/* eslint-disable default-case, no-param-reassign */
describe('TrackProvider reducer tests', () => {
  let state;
  let artistName;
  let trackId;
  beforeEach(() => {
    state = initialState;
    artistName = 'Johar C Rohan';
    trackId = 123;
  });

  it('should return the initial state', () => {
    expect(trackProviderReducer(undefined, {})).toEqual(state);
  });

  it('should return the updated state when an action of type REQUEST_GET_TRACKS is dispatched', () => {
    const expectedResult = { ...state, list: { ...state.list, artistName } };
    expect(
      trackProviderReducer(state, {
        type: trackProviderTypes.REQUEST_GET_TRACKS,
        artistName
      })
    ).toEqual(expectedResult);
  });

  it('should return the updated state when an action of type SUCCESS_GET_TRACKS is dispatched', () => {
    const expectedResult = {
      ...state,
      list: {
        ...state.list,
        tracks: [{ artistName }],
        trackCount: 1
      }
    };
    expect(
      trackProviderReducer(state, {
        type: trackProviderTypes.SUCCESS_GET_TRACKS,
        data: {
          resultCount: 1,
          results: [{ artistName }]
        }
      })
    ).toEqual(expectedResult);
  });

  it('should return the updated state when an action of type FAILURE_GET_TRACKS is dispatched', () => {
    const expectedResult = { ...state, list: { ...state.list, error: 'something went wrong' } };
    expect(
      trackProviderReducer(state, {
        type: trackProviderTypes.FAILURE_GET_TRACKS,
        error: expectedResult.list.error
      })
    ).toEqual(expectedResult);
  });

  it('should return the updated state when an action of type CLEAR_TRACKS is dispatched', () => {
    const currentState = { ...state, list: { ...state.list, tracks: [1, 2, 3], trackCount: 3 } };
    expect(
      trackProviderReducer(currentState, {
        type: trackProviderTypes.CLEAR_TRACKS
      })
    ).toEqual(state);
  });
  it('should return the updated state when an action of type REQUEST_GET_TRACK is dispatched', () => {
    const expectedResult = { ...state, details: { ...state.details, trackId } };
    expect(
      trackProviderReducer(state, {
        type: trackProviderTypes.REQUEST_GET_TRACK,
        trackId
      })
    ).toEqual(expectedResult);
  });
  it('should return the updated state when an action of type SUCCESS_GET_TRACK is dispatched', () => {
    const expectedResult = { ...state, details: { ...state.details, track: { trackId } } };
    expect(
      trackProviderReducer(state, {
        type: trackProviderTypes.SUCCESS_GET_TRACK,
        data: expectedResult.details.track
      })
    ).toEqual(expectedResult);
  });
  it('should return the updated state when an action of type FAILURE_GET_TRACK is dispatched', () => {
    const expectedResult = { ...state, details: { ...state.details, error: 'something went wrong' } };
    expect(
      trackProviderReducer(state, {
        type: trackProviderTypes.FAILURE_GET_TRACK,
        error: expectedResult.details.error
      })
    ).toEqual(expectedResult);
  });
});
