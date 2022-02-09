import {
  selectArtist,
  selectTracks,
  selectTrackCount,
  selectTracksError,
  selectTrackId,
  selectTrack,
  selectTrackError,
  selectCurrentTrackFromTracks,
  selectTrackProviderDomain
} from '../selectors';

export const TRACK_PROVIDER_DUMMY_STATE = {
  list: {
    artistName: 'Johan Roby',
    tracks: {
      321: { trackId: 321, artistName: 'Johan Roby' },
      123: { trackId: 123, artistName: 'Johan Roby' }
    },
    trackCount: 1,
    error: 'track grid error'
  },
  details: {
    trackId: 123,
    track: { trackId: 123, artistName: 'Johan Roby' },
    error: 'track error'
  }
};

describe('TrackProvider selector tests', () => {
  let mockedState;

  beforeEach(() => {
    mockedState = {
      trackProvider: TRACK_PROVIDER_DUMMY_STATE
    };
  });

  it('should select trackProvider using selectTrackProviderDomain', () => {
    expect(selectTrackProviderDomain(mockedState)).toEqual(mockedState.trackProvider);
  });

  it('should select artistName using selectArtist selector', () => {
    const artistSelector = selectArtist();
    expect(artistSelector(mockedState)).toEqual(mockedState.trackProvider.list.artistName);
  });

  it('should select tracks using selectArtistTracks selector', () => {
    const tracksSelector = selectTracks();
    expect(tracksSelector(mockedState)).toEqual(mockedState.trackProvider.list.tracks);
  });

  it('should select trackCount using selectTrack selector', () => {
    const trackCountSelector = selectTrackCount();
    expect(trackCountSelector(mockedState)).toEqual(mockedState.trackProvider.list.trackCount);
  });

  it('should select track list error using selectTracksError selector', () => {
    const tracksErrorSelector = selectTracksError();
    expect(tracksErrorSelector(mockedState)).toEqual(mockedState.trackProvider.list.error);
  });

  it('should select trackId using selectTrackId selector', () => {
    const trackIdSelector = selectTrackId();
    expect(trackIdSelector(mockedState)).toEqual(mockedState.trackProvider.details.trackId);
  });

  it('should select track using selectTrack selector', () => {
    const trackSelector = selectTrack();
    expect(trackSelector(mockedState)).toEqual(mockedState.trackProvider.details.track);
  });

  it('should select track details error using selectTrackError selector', () => {
    const trackErrorSelector = selectTrackError();
    expect(trackErrorSelector(mockedState)).toEqual(mockedState.trackProvider.details.error);
  });

  it('should select track from tracks using selectTrackProviderDomain selector', () => {
    const trackFromTracksSelector = selectCurrentTrackFromTracks();
    expect(trackFromTracksSelector(mockedState)).toEqual(mockedState.trackProvider.details.track);
  });
});
