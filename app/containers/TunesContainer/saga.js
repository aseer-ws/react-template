import { getTunes } from '@app/services/tunesApi';
import { takeLatest, call, put } from 'redux-saga/effects';
import { tunesContainerTypes, tunesContainerCreators } from './reducer';

const { successGetSongs, failureGetSongs } = tunesContainerCreators;

export function* getArtistSongs(action) {
  const response = yield call(getTunes, action.artistName);
  const { ok, data, problem } = response;
  if (ok && data) {
    yield put(successGetSongs(data));
  } else {
    yield put(failureGetSongs(data ?? problem));
  }
}

export default function* tunesContainerSaga() {
  yield takeLatest(tunesContainerTypes.REQUEST_GET_SONGS, getArtistSongs);
}
