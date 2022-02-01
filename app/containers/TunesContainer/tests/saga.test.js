/**
 * Test tunesContainer sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { call, put, takeLatest } from 'redux-saga/effects';
import tunesContainerSaga, { getArtistSongs } from '../saga';
import { tunesContainerTypes } from '../reducer';
import { getTunes } from '@services/tunesApi';
import { apiResponseGenerator } from '@app/utils/testUtils';

describe('TunesContainer saga tests', () => {
  const generator = tunesContainerSaga();
  const artistName = 'Arijit Singh';
  let getArtistSongsGenerator = getArtistSongs({ artistName });

  it('should start task to watch for SET_ARTIST action', () => {
    expect(generator.next().value).toEqual(takeLatest(tunesContainerTypes.SET_ARTIST, getArtistSongs));
  });

  it('should ensure that the action SET_TUNES_ERROR is dispatched when api call fails', () => {
    const res = getArtistSongsGenerator.next().value;
    expect(res).toEqual(call(getTunes, artistName));
    const errorResponse = {
      resultCount: 0,
      results: []
    };
    expect(getArtistSongsGenerator.next(apiResponseGenerator(false, errorResponse)).value).toEqual(
      put({
        type: tunesContainerTypes.SET_TUNES_ERROR,
        error: errorResponse
      })
    );
  });

  it('should ensure that the action SET_SONGS_DATA is dispatched when api is success', () => {
    getArtistSongsGenerator = getArtistSongs({ artistName });
    const res = getArtistSongsGenerator.next().value;
    expect(res).toEqual(call(getTunes, artistName));
    const songsResponse = {
      resultCount: 1,
      results: [{ artistName }]
    };
    expect(getArtistSongsGenerator.next(apiResponseGenerator(true, songsResponse)).value).toEqual(
      put({
        type: tunesContainerTypes.SET_SONGS_DATA,
        songsData: songsResponse
      })
    );
  });
});
