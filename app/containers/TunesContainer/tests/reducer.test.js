// import produce from 'immer'
import { tunesContainerReducer, tunesContainerTypes, initialState } from '../reducer';

/* eslint-disable default-case, no-param-reassign */
describe('TunesContainer reducer tests', () => {
  let state;
  beforeEach(() => {
    state = initialState;
  });

  it('should return the initial state', () => {
    expect(tunesContainerReducer(undefined, {})).toEqual(state);
  });

  it('should return the update the state when an action of type DEFAULT is dispatched', () => {
    const expectedResult = {
      artist: 'Arijit Singh',
      songsData: {},
      tunesError: null
    };
    expect(
      tunesContainerReducer(state, {
        type: tunesContainerTypes.SET_ARTIST,
        artistName: 'Arijit Singh'
      })
    ).toEqual(expectedResult);
  });
});
