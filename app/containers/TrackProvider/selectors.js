import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the trackProvider state domain
 */

const selectTrackProviderDomain = (state) => state.trackProvider || initialState;

const selectArtist = () => createSelector(selectTrackProviderDomain, (substate) => substate.list.artistName);

const selectTracks = () => createSelector(selectTrackProviderDomain, (substate) => substate.list.tracks);

const selectTrackCount = () => createSelector(selectTrackProviderDomain, (substate) => substate.list.trackCount);

const selectTracksError = () => createSelector(selectTrackProviderDomain, (substate) => substate.list.error);

const selectTrackId = () => createSelector(selectTrackProviderDomain, (substate) => substate.details.trackId);

const selectTrack = () => createSelector(selectTrackProviderDomain, (substate) => substate.details.track);

const selectTrackError = () => createSelector(selectTrackProviderDomain, (substate) => substate.details.error);

const selectCurrentTrackFromTracks = () => {
  const tracksSelector = selectTracks();
  const trackIdSelector = selectTrackId();
  return createSelector(tracksSelector, trackIdSelector, (trackList, trackIdentity) =>
    trackList?.find((track) => track.trackId === trackIdentity)
  );
};

export {
  selectTrackProviderDomain,
  selectArtist,
  selectTracks,
  selectTrackCount,
  selectTracksError,
  selectTrackId,
  selectTrack,
  selectTrackError,
  selectCurrentTrackFromTracks
};
