/**
 *
 * Tests for TunesContainer
 *
 *
 */

import React from 'react';
import { renderProvider, timeout } from '@utils/testUtils';
import { mapDispatchToProps, TunesContainerTest as TunesContainer } from '../index';
import { fireEvent } from '@testing-library/react';
import { translate } from '@app/components/IntlGlobalProvider';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { tunesContainerTypes } from '../reducer';

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

  it('should render all tracks in TrackCard components', () => {
    const artistName = 'Artist A';
    const songsData = {
      resultCount: 3,
      results: [
        {
          trackName: 'Track A',
          collectionName: 'Collection A',
          trackPrice: 100,
          primaryGenreName: 'HipHop'
        },
        {
          trackName: 'Track B',
          collectionName: 'Collection B',
          trackPrice: 50,
          primaryGenreName: 'Pop'
        },
        {
          trackName: 'Track C',
          collectionName: 'Collection C',
          trackPrice: 40,
          primaryGenreName: 'Jaz'
        }
      ]
    };

    const { getAllByTestId } = renderProvider(<TunesContainer songsData={songsData} artist={artistName} />);
    expect(getAllByTestId('track-card').length).toBe(songsData.resultCount);
  });

  it('should show tunesError message', () => {
    const errorMessage = 'Unable to find the tracks for artist';
    const { getByTestId } = renderProvider(<TunesContainer tunesError={errorMessage} />);

    expect(getByTestId('tunes-error')).toHaveTextContent(errorMessage);
  });

  it('should redirect to /repos route when clicked repo link', () => {
    const history = createBrowserHistory();
    const { getByTestId } = renderProvider(
      <Router history={history}>
        <TunesContainer />
      </Router>
    );
    expect(getByTestId('repos-redirect')).toBeInTheDocument();
    expect(history.location.pathname).toEqual('/');
  });

  it('should render Skeleton Comp when "loading" is true', async () => {
    const artistName = 'Author B';
    const { getByTestId, baseElement } = renderProvider(
      <TunesContainer dispatchClearSongs={submitSpy} artist={artistName} />
    );
    fireEvent.change(getByTestId(artistSearchBarId), { target: { value: artistName } });
    await timeout(600);
    expect(baseElement.getElementsByClassName('ant-skeleton').length).toBe(0);
  });

  it('should validate mapDispatchToProps actions', async () => {
    const dispatchSpy = jest.fn();
    const artistName = 'Artist C';

    const actions = {
      dispatchGetArtistSongs: { artistName, type: tunesContainerTypes.REQUEST_GET_SONGS },
      dispatchClearSongs: { type: tunesContainerTypes.CLEAR_SONGS }
    };

    const props = mapDispatchToProps(dispatchSpy);
    props.dispatchGetArtistSongs(artistName);
    expect(dispatchSpy).toHaveBeenCalledWith(actions.dispatchGetArtistSongs);

    await timeout(600);

    props.dispatchClearSongs();
    expect(dispatchSpy).toHaveBeenCalledWith(actions.dispatchClearSongs);
  });
});
