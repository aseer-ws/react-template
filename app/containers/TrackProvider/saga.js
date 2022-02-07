import { getTunes } from '@app/services/tunesApi';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { trackProviderCreators, trackProviderTypes } from './reducer';
import { selectCurrentTrackFromTracks } from './selectors';

const { successGetTracks, failureGetTracks, successGetTrack, failureGetTrack } = trackProviderCreators;

export function* getArtistTracks(action) {
  const response = yield call(getTunes, action.artistName);
  const { ok, data, problem } = response;
  if (ok && data) {
    yield put(successGetTracks(data));
  } else {
    yield put(failureGetTracks(data ?? problem));
  }
}

export const CURRENT_TRACK_FROM_TRACKS_SELECTOR = selectCurrentTrackFromTracks();

export function* getCurrentTrack(action) {
  const TrackFromTunesContainer = yield select(CURRENT_TRACK_FROM_TRACKS_SELECTOR);
  if (!TrackFromTunesContainer) {
    const res = yield call(getTunes, action.trackId);
    const { ok, data, problem } = res;
    if (ok && data && data?.results) {
      yield put(successGetTrack(data.results[0]));
    } else {
      yield put(failureGetTrack(data ?? problem));
    }
  } else {
    yield put(successGetTrack(TrackFromTunesContainer));
  }
}

function* trackContainerSaga() {
  yield takeLatest(trackProviderTypes.REQUEST_GET_TRACK, getCurrentTrack);
}

function* trackGridContainerSaga() {
  yield takeLatest(trackProviderTypes.REQUEST_GET_TRACKS, getArtistTracks);
}

export { trackContainerSaga, trackGridContainerSaga };
