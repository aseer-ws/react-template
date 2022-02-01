import { getTunes } from '@app/services/tunesApi';
import { takeLatest, call, put } from 'redux-saga/effects';
import { tunesContainerTypes } from './reducer';

export function* getArtistSongs(action) {
  const response = yield call(getTunes, action.artistName);
  const { ok, data } = response;
  if (ok && data) {
    yield put({ type: tunesContainerTypes.SET_SONGS_DATA, songsData: data });
  } else {
    yield put({ type: tunesContainerTypes.SET_TUNES_ERROR, error: data });
  }
}

export default function* tunesContainerSaga() {
  yield takeLatest(tunesContainerTypes.SET_ARTIST, getArtistSongs);
}
