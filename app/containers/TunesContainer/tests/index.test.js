/**
 *
 * Tests for TunesContainer
 *
 *
 */

import React from 'react';
import { renderProvider, timeout } from '@utils/testUtils';
import { TunesContainerTest as TunesContainer } from '../index';
import { fireEvent } from '@testing-library/react';
import { translate } from '@app/components/IntlGlobalProvider';

describe('<TunesContainer /> container tests', () => {
  let submitSpy;
  let artistSearchBarId;

  beforeEach(() => {
    submitSpy = jest.fn();
    artistSearchBarId = 'artist-search-bar';
  });
  it('should render and match the snapshot', () => {
    const { baseElement } = renderProvider(<TunesContainer />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should trigger dispatchGetArtistSongs when a change is made in search bar', async () => {
    const { getByTestId } = renderProvider(<TunesContainer dispatchGetArtistSongs={submitSpy} />);

    fireEvent.change(getByTestId(artistSearchBarId), {
      target: {
        value: 'A'
      }
    });

    await timeout(500);

    expect(submitSpy).toBeCalled();
  });

  it('should show message when songs are empty for artist name', async () => {
    const artistName = 'Arijit Singh';
    const { getByTestId } = renderProvider(<TunesContainer artist={artistName} />);

    expect(getByTestId('tunes-artist')).toHaveTextContent(translate('itunes_artist_name', { artistName }));
    expect(getByTestId('empty-track-text')).toHaveTextContent(translate('itunes_empty_track'));
  });

  it('should run dispatchClearSongs when search bar changed to empty string', async () => {
    const artistName = 'Arijit Singh';
    const songsData = {
      resultCount: 1,
      results: [{ artistName }]
    };
    const { getByTestId } = renderProvider(
      <TunesContainer artist={artistName} songsData={songsData} dispatchClearSongs={submitSpy} />
    );

    fireEvent.change(getByTestId(artistSearchBarId), { target: { value: '' } });

    await timeout(500);

    expect(submitSpy).toBeCalled();
  });

  it('should show placeholder message when songsData or artisName is empty', () => {
    const { getByText } = renderProvider(<TunesContainer />);
    const placeholderText = translate('songs_data_empty');
    expect(getByText(placeholderText)).toBeInTheDocument();
  });

  it('should render the songs in TrackCard component', () => {
    const artistName = 'Arijit Singh';
    const songsData = {
      resultCount: 1,
      results: [{ artistName }]
    };
    const { getByTestId } = renderProvider(<TunesContainer artist={artistName} songsData={songsData} />);
    expect(getByTestId('track-card')).toBeInTheDocument();
  });
});
