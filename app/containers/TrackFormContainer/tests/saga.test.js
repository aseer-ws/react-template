/**
 * Test trackFormContainer sagas
 */

import { takeLatest } from 'redux-saga/effects';
import trackFormContainerSaga, { defaultFunction } from '../saga';
import { trackFormContainerTypes } from '../reducer';

describe('TrackFormContainer saga tests', () => {
  const generator = trackFormContainerSaga();

  it('should start task to watch for DEFAULT_ACTION action', () => {
    expect(generator.next().value).toEqual(takeLatest(trackFormContainerTypes.DEFAULT_ACTION, defaultFunction));
  });
});
