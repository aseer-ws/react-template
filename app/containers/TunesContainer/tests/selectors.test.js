import { selectTunesArtist, selectTunesContainerDomain, selectTunesError, selectTunesSongs } from '../selectors';

describe('TunesContainer selector tests', () => {
  let mockedState;
  let artistName;
  let songs;
  let tunesError;

  beforeEach(() => {
    artistName = 'Arijit Singh';
    songs = {
      resultCounts: 1,
      results: [{ artistName }]
    };
    tunesError = 'Unable to collection songs';

    mockedState = {
      tunesContainer: {
        artistName,
        songs,
        tunesError
      }
    };
  });

  it('should select the tunesContainer state', () => {
    expect(selectTunesContainerDomain(mockedState)).toEqual(mockedState.tunesContainer);
  });

  it('should select artistName', () => {
    const artistSelector = selectTunesArtist();
    expect(artistSelector(mockedState)).toEqual(mockedState.tunesContainer.artistName);
  });

  it('should select songs data', () => {
    const songsSelector = selectTunesSongs();
    expect(songsSelector(mockedState)).toEqual(mockedState.tunesContainer.songs);
  });

  it('should select tunesError', () => {
    const errorSelector = selectTunesError();
    expect(errorSelector(mockedState)).toEqual(mockedState.tunesContainer.tunesError);
  });
});
