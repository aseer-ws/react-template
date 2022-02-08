/**
 * Test trackProvider sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { getTunes } from '@app/services/tunesApi';
import { apiResponseGenerator } from '@app/utils/testUtils';
import { takeLatest, put, select, call } from 'redux-saga/effects';
import { trackProviderCreators, trackProviderTypes } from '../reducer';
import trackProviderSaga, { CURRENT_TRACK_FROM_TRACKS_SELECTOR, getArtistTracks, getCurrentTrack } from '../saga';
import { TRACK_PROVIDER_DUMMY_STATE } from './selectors.test';

const { successGetTracks, failureGetTracks, successGetTrack, failureGetTrack } = trackProviderCreators;

describe('TrackProvider saga tests', () => {
  let trackId;
  let artistName;

  beforeAll(() => {
    trackId = TRACK_PROVIDER_DUMMY_STATE.details.trackId;
    artistName = TRACK_PROVIDER_DUMMY_STATE.list.artistName;
  });

  it('should start task to watch for REQUEST_SET_TRACK action', () => {
    const generator = trackProviderSaga();
    expect(generator.next().value).toEqual(takeLatest(trackProviderTypes.REQUEST_GET_TRACK, getCurrentTrack));
  });

  it('should start task to watch for REQUEST_GET_SONGS action', () => {
    const generator = trackProviderSaga();
    generator.next();
    expect(generator.next().value).toEqual(takeLatest(trackProviderTypes.REQUEST_GET_TRACKS, getArtistTracks));
  });

  it('should yield select(CURRENT_TRACK_FROM_TRACKS_SELECTOR) effect', () => {
    const getTrackGenerator = getCurrentTrack({ trackId });
    const result = getTrackGenerator.next().value;
    expect(result).toStrictEqual(select(CURRENT_TRACK_FROM_TRACKS_SELECTOR));
  });

  it('should dispatch SUCCESS_GET_TRACK if select effect were able to get track from trackProvider.list', () => {
    const getTrackGenerator = getCurrentTrack({ trackId });
    getTrackGenerator.next();
    const trackFromTrackGrid = { trackId };
    expect(getTrackGenerator.next(trackFromTrackGrid).value).toEqual(put(successGetTrack(trackFromTrackGrid)));
  });

  it("should yield call effect when select effect couldn't get track from trackProvider.list", () => {
    const getTrackGenerator = getCurrentTrack({ trackId });
    getTrackGenerator.next();
    expect(getTrackGenerator.next(undefined).value).toEqual(call(getTunes, trackId));
  });

  it('should dispatch SUCCESS_GET_TRACK when call effect get track', () => {
    const getTrackGenerator = getCurrentTrack({ trackId });
    getTrackGenerator.next();
    getTrackGenerator.next(undefined);
    const trackFromGetTunesAPI = {
      resultCount: 1,
      results: [{ trackId }]
    };
    const apiResponse = apiResponseGenerator(true, trackFromGetTunesAPI);
    expect(getTrackGenerator.next(apiResponse).value).toEqual(put(successGetTrack(trackFromGetTunesAPI.results[0])));
  });

  it('should dispatch FAILURE_GET_TRACKS when call effect failed to get track', () => {
    const getTrackGenerator = getCurrentTrack({ trackId });
    getTrackGenerator.next();
    getTrackGenerator.next(undefined);
    const errorRes = 'Unable to find the track';
    const apiResponse = apiResponseGenerator(false, errorRes);
    expect(getTrackGenerator.next(apiResponse).value).toEqual(put(failureGetTrack(errorRes)));
  });

  it('should ensure that the action FAILURE_GET_TRACKS is dispatched when api call fails', () => {
    const getTracksGenerator = getArtistTracks({ artistName });
    const res = getTracksGenerator.next().value;
    expect(res).toEqual(call(getTunes, artistName));
    const errorResponse = {
      errorMessage: 'There is an while fetching songs for the artist'
    };
    expect(getTracksGenerator.next(apiResponseGenerator(false, errorResponse)).value).toEqual(
      put(failureGetTracks(errorResponse))
    );
  });

  it('should ensure that the action SUCCESS_GET_TRACKS is dispatched when api is success', () => {
    const getTracksGenerator = getArtistTracks({ artistName });
    const res = getTracksGenerator.next().value;
    expect(res).toEqual(call(getTunes, artistName));
    const trackResponse = {
      resultCount: 1,
      results: [{ artistName }]
    };
    expect(getTracksGenerator.next(apiResponseGenerator(true, trackResponse)).value).toEqual(
      put(successGetTracks(trackResponse))
    );
  });
});
