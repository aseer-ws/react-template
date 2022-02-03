// import produce from 'immer'
import { tunesContainerReducer, tunesContainerTypes, initialState } from '../reducer';

/* eslint-disable default-case, no-param-reassign */
describe('TunesContainer reducer tests', () => {
  let state;
  beforeEach(() => {
    state = initialState;
  });

  it('should return the tunesContainer initial state', () => {
    expect(tunesContainerReducer(undefined, {})).toEqual(state);
  });

  it('should return the updated state when an action of type REQUEST_GET_SONGS is dispatched', () => {
    const expectedResult = {
      artistName: 'Arijit Singh',
      songs: {},
      tunesError: null
    };
    expect(
      tunesContainerReducer(state, {
        type: tunesContainerTypes.REQUEST_GET_SONGS,
        artistName: 'Arijit Singh'
      })
    ).toEqual(expectedResult);
  });

  it('should update the state when SUCCESS_GET_SONGS action is dispatched', () => {
    const data = {
      resultsCount: 1,
      results: [{ artistName: state.artistName }]
    };
    const expectedResult = {
      artistName: state.artistName,
      songs: data,
      tunesError: null
    };
    expect(
      tunesContainerReducer(state, {
        type: tunesContainerTypes.SUCCESS_GET_SONGS,
        data
      })
    ).toEqual(expectedResult);
  });

  it('should update the tunesError state when FAILURE_GET_SONGS action is dispatched', () => {
    const error = 'Unable to find songs for the artist';
    const expectedResult = {
      artistName: state.artistName,
      songs: {},
      tunesError: error
    };
    expect(
      tunesContainerReducer(state, {
        type: tunesContainerTypes.FAILURE_GET_SONGS,
        error
      })
    ).toEqual(expectedResult);
  });

  it('should clear songs when CLEAR_SONGS action is dispatched', () => {
    expect(
      tunesContainerReducer(state, {
        type: tunesContainerTypes.CLEAR_SONGS
      })
    ).toEqual(initialState);
  });
});
