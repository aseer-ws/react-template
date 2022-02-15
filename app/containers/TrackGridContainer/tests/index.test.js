/**
 *
 * Tests for TrackGridContainer
 *
 *
 */

import { translate } from '@app/components/IntlGlobalProvider';
import { TOGGLE_PLAY_BTN_TEST_ID } from '@app/components/TrackCard';
import { mapDispatchToProps } from '@app/containers/TrackGridContainer';
import { trackProviderTypes } from '@app/containers/TrackProvider/reducer';
import { fireEvent, waitFor } from '@testing-library/react';
import { createSpyOnAudio, renderProvider, timeout } from '@utils/testUtils';
import { createBrowserHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import { CORS_ERROR_MESSAGE, TrackGridContainerTest as TrackGridContainer } from '../index';

describe('<TrackGridContainer /> container tests', () => {
  let submitSpy;
  let artistSearchBarId;

  beforeEach(() => {
    submitSpy = jest.fn();
    artistSearchBarId = 'artist-search-bar';
  });

  afterEach(() => {
    jest.clearAllMocks();
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
    const tracks = {
      123: {
        trackId: 123
      }
    };
    const { getByTestId, baseElement } = renderProvider(<TrackGridContainer tracks={tracks} />);

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
    const { getByTestId } = renderProvider(<TrackGridContainer artist={artistName} />);

    expect(getByTestId('tunes-artist')).toHaveTextContent(translate('itunes_artist_name', { artistName }));
    await waitFor(() => expect(getByTestId('empty-track-text')).toBeInTheDocument());
    expect(getByTestId('empty-track-text')).toHaveTextContent(translate('itunes_empty_track'));
  });

  it('should run dispatchClearTracks when search bar changed to empty string', async () => {
    const artistName = 'Arijit Singh';
    const tracks = {
      123: { trackId: 123, artistName }
    };

    const { getByTestId } = renderProvider(
      <TrackGridContainer artist={artistName} trackCount={1} tracks={tracks} dispatchClearTracks={submitSpy} />
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
      123: { artistName }
    };
    const { getByTestId } = renderProvider(<TrackGridContainer artist={artistName} tracks={tracksData} />);
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
    const tracksError = translate('something_went_wrong');
    const { getByTestId } = renderProvider(<TrackGridContainer tracksError={tracksError} />);

    expect(getByTestId('tunes-error')).toHaveTextContent(tracksError);
  });

  it('should show error notification for CORS error when tracksError is NETWORK_ERROR', async () => {
    const tracksError = 'NETWORK_ERROR';
    const { baseElement } = renderProvider(<TrackGridContainer tracksError={tracksError} />);
    await waitFor(() =>
      expect(baseElement.getElementsByClassName('ant-notification-notice-message')[0]).toHaveTextContent(
        CORS_ERROR_MESSAGE
      )
    );
  });

  it('should set currentTrackRef to the playing audioRef', async () => {
    const playSpy = createSpyOnAudio('play');
    const previewUrl =
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/c3/30/11/c3301120-3e69-9a93-3cf7-bdb49133d40b/mzaf_1948113783309339626.plus.aac.p.m4a';
    const tracks = {
      123: { trackId: 123, previewUrl }
    };

    const { getByTestId } = renderProvider(<TrackGridContainer tracks={tracks} />);
    const togglePlayBtn = getByTestId(TOGGLE_PLAY_BTN_TEST_ID);
    fireEvent.click(togglePlayBtn);
    await waitFor(() => expect(playSpy).toBeCalled());
  });

  it('should set currentTrackRef to null if audio paused', async () => {
    const playSpy = createSpyOnAudio('play');
    const pauseSpy = createSpyOnAudio('pause');
    const previewUrl =
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/c3/30/11/c3301120-3e69-9a93-3cf7-bdb49133d40b/mzaf_1948113783309339626.plus.aac.p.m4a';
    const tracks = {
      123: { trackId: 123, previewUrl }
    };

    const { getByTestId } = renderProvider(<TrackGridContainer tracks={tracks} />);

    fireEvent.click(getByTestId(TOGGLE_PLAY_BTN_TEST_ID));
    await waitFor(() => expect(playSpy).toBeCalledTimes(1));
    Object.defineProperty(window.HTMLAudioElement.prototype, 'paused', { value: true, writable: true });
    fireEvent.click(getByTestId(TOGGLE_PLAY_BTN_TEST_ID));
    await waitFor(() => expect(pauseSpy).toBeCalledTimes(1));
  });

  it('should set currentTrackRef to null if audio ended', async () => {
    const playSpy = createSpyOnAudio('play');
    const pauseSpy = createSpyOnAudio('pause');
    Object.defineProperty(window.HTMLAudioElement.prototype, 'playbackRate', { value: 16 });
    const previewUrl =
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/c3/30/11/c3301120-3e69-9a93-3cf7-bdb49133d40b/mzaf_1948113783309339626.plus.aac.p.m4a';
    const tracks = {
      123: { trackId: 123, previewUrl }
    };

    const { getByTestId } = renderProvider(<TrackGridContainer tracks={tracks} />);

    fireEvent.click(getByTestId(TOGGLE_PLAY_BTN_TEST_ID));
    await waitFor(() => expect(playSpy).toBeCalledTimes(1));
    Object.defineProperty(window.HTMLAudioElement.prototype, 'ended', { value: true, writable: true });
    fireEvent.click(getByTestId(TOGGLE_PLAY_BTN_TEST_ID));
    await waitFor(() => expect(pauseSpy).toBeCalledTimes(1));
  });

  it('should change currentTrackRef while playing second audio', async () => {
    const playSpy = createSpyOnAudio('play').mockImplementation(() => {});
    const previewUrl =
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/c3/30/11/c3301120-3e69-9a93-3cf7-bdb49133d40b/mzaf_1948113783309339626.plus.aac.p.m4a';
    const tracks = {
      123: { trackId: 123, previewUrl },
      312: { trackId: 321, previewUrl }
    };

    const { getAllByTestId } = renderProvider(<TrackGridContainer tracks={tracks} />);

    const togglePlayBtns = getAllByTestId(TOGGLE_PLAY_BTN_TEST_ID);
    // const audioTracks = getAllByTestId('audio-track');
    fireEvent.click(togglePlayBtns[0]);
    await waitFor(() => expect(playSpy).toBeCalledTimes(1));
    fireEvent.click(togglePlayBtns[1]);
    await waitFor(() => expect(playSpy).toBeCalledTimes(2));
  });
});
