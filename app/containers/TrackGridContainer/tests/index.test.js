/**
 *
 * Tests for TrackGridContainer
 *
 *
 */

import React from 'react';
import { renderProvider, timeout } from '@utils/testUtils';
import { TrackGridContainerTest as TrackGridContainer } from '../index';
import { fireEvent, waitFor } from '@testing-library/react';
import { translate } from '@app/components/IntlGlobalProvider';
import { mapDispatchToProps } from '@app/containers/TrackGridContainer';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { trackProviderTypes } from '@app/containers/TrackProvider/reducer';

describe('<TrackGridContainer /> container tests', () => {
  let submitSpy;
  let artistSearchBarId;

  beforeEach(() => {
    submitSpy = jest.fn();
    artistSearchBarId = 'artist-search-bar';
  });
  it('should render and match the snapshot', () => {
    const { baseElement } = renderProvider(<TrackGridContainer />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should trigger dispatchGetTracks when a change is made in search bar', async () => {
    const { getByTestId } = renderProvider(<TrackGridContainer dispatchGetTracks={submitSpy} />);

    fireEvent.change(getByTestId(artistSearchBarId), {
      target: {
        value: 'A'
      }
    });

    await timeout(500);

    expect(submitSpy).toBeCalled();
  });

  it('should trigger dispatchGetTracks when an aritstName is given and pressed enter in search bar', async () => {
    const { getByTestId } = renderProvider(<TrackGridContainer dispatchGetTracks={submitSpy} />);
    const searchBar = getByTestId(artistSearchBarId);
    const artistName = 'Johan Roby';
    fireEvent.keyDown(searchBar, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      target: {
        value: artistName
      }
    });
    await timeout(500);
    expect(submitSpy).toBeCalled();
  });

  it('should show loading Skeleton while searching for tracks', async () => {
    const tracks = [
      {
        trackId: 123
      }
    ];
    const { getByTestId, baseElement } = renderProvider(
      <TrackGridContainer tracks={tracks} dispatchGetTracks={submitSpy} />
    );

    fireEvent.change(getByTestId(artistSearchBarId), {
      target: {
        value: 'Avatar'
      }
    });
    await timeout(500);
    await waitFor(() => expect(baseElement.getElementsByClassName('ant-skeleton').length).toBe(0));
  });

  it('should show message when tracks are empty for invalid artist name', async () => {
    const artistName = 'kabdsfkhaxj';
    const { getByTestId } = renderProvider(<TrackGridContainer artist={artistName} dispatchGetTracks={submitSpy} />);

    expect(getByTestId('tunes-artist')).toHaveTextContent(translate('itunes_artist_name', { artistName }));
    await waitFor(() => expect(getByTestId('empty-track-text')).toBeInTheDocument());
    expect(getByTestId('empty-track-text')).toHaveTextContent(translate('itunes_empty_track'));
  });

  it('should run dispatchClearTracks when search bar changed to empty string', async () => {
    const artistName = 'Arijit Singh';
    const trackssData = {
      resultCount: 1,
      results: [{ artistName }]
    };
    const { getByTestId } = renderProvider(
      <TrackGridContainer
        artist={artistName}
        trackCount={trackssData.resultCount}
        tracks={trackssData.results}
        dispatchClearTracks={submitSpy}
      />
    );

    fireEvent.change(getByTestId(artistSearchBarId), { target: { value: '' } });

    await timeout(500);

    expect(submitSpy).toBeCalled();
  });

  it('should redirect to /repos route when clicked repo link', () => {
    const history = createBrowserHistory();
    const { getByTestId } = renderProvider(
      <Router history={history}>
        <TrackGridContainer />
      </Router>
    );
    expect(getByTestId('repos-redirect')).toBeInTheDocument();
    expect(history.location.pathname).toEqual('/');
  });

  it('should show placeholder message when songsData or artisName is empty', () => {
    const { getByText } = renderProvider(<TrackGridContainer />);
    const placeholderText = translate('songs_data_empty');
    expect(getByText(placeholderText)).toBeInTheDocument();
  });

  it('should render the songs in TrackCard component', () => {
    const artistName = 'Arijit Singh';
    const tracksData = {
      resultCount: 1,
      results: [{ artistName }]
    };
    const { getByTestId } = renderProvider(<TrackGridContainer artist={artistName} tracks={tracksData.results} />);
    expect(getByTestId('track-card')).toBeInTheDocument();
  });

  it('should mapDispatchToProps dispatches actions ', async () => {
    const dispatchSpy = jest.fn();
    const artistName = 'Author Z';
    const actions = {
      dispatchGetTracks: {
        type: trackProviderTypes.REQUEST_GET_TRACKS,
        artistName
      },
      dispatchClearTracks: {
        type: trackProviderTypes.CLEAR_TRACKS
      }
    };

    const props = mapDispatchToProps(dispatchSpy);
    props.dispatchGetTracks(artistName);

    await timeout(600);

    expect(dispatchSpy).toHaveBeenCalledWith(actions.dispatchGetTracks);
    props.dispatchClearTracks();
    expect(dispatchSpy).toHaveBeenCalledWith(actions.dispatchClearTracks);
  });

  it('should show error messages when tunesError is passed', () => {
    const tunesError = translate('something_went_wrong');
    const { getByTestId } = renderProvider(<TrackGridContainer tracksError={tunesError} />);

    expect(getByTestId('tunes-error')).toHaveTextContent(tunesError);
  });
});
