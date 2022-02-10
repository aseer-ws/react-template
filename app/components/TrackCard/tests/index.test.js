import { translate } from '@app/components/IntlGlobalProvider';
import { renderProvider } from '@app/utils/testUtils';
import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import TrackCard, { TOGGLE_PLAY_BTN_TEST_ID } from '..';

function createSpyOnMedia(event) {
  return jest.spyOn(window.HTMLAudioElement.prototype, event).mockImplementation(() => {});
}

describe('<TrackCard /> tests', () => {
  let trackUrl;
  let playPauseButtonId;
  // let audioTrack;
  let playSpy;
  let pauseSpy;

  beforeAll(() => {
    trackUrl =
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/fb/55/23/fb552336-6b1f-99d7-31b0-55fa6f1796e1/mzaf_11062059991207198732.plus.aac.p.m4a';
    playPauseButtonId = TOGGLE_PLAY_BTN_TEST_ID;
    // audioTrack = 'audio-track';
    playSpy = createSpyOnMedia('play');
    pauseSpy = createSpyOnMedia('pause');
  });

  afterEach(() => {
    playSpy?.mockReset();
    pauseSpy?.mockReset();
  });

  it('should render and match the snapshot', () => {
    const { baseElement } = renderProvider(<TrackCard />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should render to the screen without props', () => {
    const { getByTestId } = renderProvider(<TrackCard />);
    expect(getByTestId('track-card')).toBeInTheDocument();
  });

  it('should render to the screen with content', () => {
    const trackName = 'Show me the meaning';
    const artworkUrl100 = 'https://testimages.org/img/testimages_screenshot.jpg';
    const collectionName = 'Backstreet Boys';
    const trackPrice = 3.1;
    const primaryGenreName = 'Pop';
    const trackCardProps = {
      trackName,
      artworkUrl100,
      collectionName,
      trackPrice,
      primaryGenreName
    };

    const { getByTestId } = renderProvider(<TrackCard {...trackCardProps} />);

    expect(getByTestId('track-name')).toHaveTextContent(trackName);
    expect(getByTestId('collection-name')).toHaveTextContent(collectionName);
    expect(getByTestId('track-price')).toHaveTextContent(trackPrice);
    expect(getByTestId('track-genre')).toHaveTextContent(primaryGenreName);
  });

  it('should render the fallback text messages if data is empty', () => {
    const { getByTestId } = renderProvider(<TrackCard />);
    expect(getByTestId('track_name_unavailable')).toHaveTextContent(translate('track_name_unavailable'));
    expect(getByTestId('collection_name_unavailable')).toHaveTextContent(translate('collection_name_unavailable'));
    expect(getByTestId('track_price_unavailable')).toHaveTextContent(translate('track_price_unavailable'));
    expect(getByTestId('track_genre_unavailable')).toHaveTextContent(translate('track_genre_unavailable'));
  });

  it('should  play the audio if clicked on play pause button', async () => {
    const { getByTestId } = renderProvider(<TrackCard previewUrl={trackUrl} />);
    fireEvent.click(getByTestId(playPauseButtonId));
    await waitFor(() => expect(playSpy).toHaveBeenCalledTimes(1));
  });

  it('should pause the playing audio if clicked on play pause button', async () => {
    const { getByTestId } = renderProvider(<TrackCard previewUrl={trackUrl} />);
    playSpy = jest.spyOn(window.HTMLAudioElement.prototype, 'play');
    pauseSpy = jest.spyOn(window.HTMLAudioElement.prototype, 'pause');
    fireEvent.click(getByTestId(playPauseButtonId));
    await waitFor(() => expect(playSpy).toHaveBeenCalledTimes(1));
    fireEvent.click(getByTestId(playPauseButtonId));
    await waitFor(() => expect(pauseSpy).toHaveBeenCalledTimes(1));
  });

  it('should set StyleImage "animate" prop to "true" when audio is playing', async () => {
    const { getByTestId } = renderProvider(<TrackCard previewUrl={trackUrl} />);
    expect(getByTestId('track-image')).toHaveAttribute('animate', 'false');
    fireEvent.click(getByTestId(playPauseButtonId));
    await waitFor(() => expect(playSpy).toHaveBeenCalledTimes(1));
    expect(getByTestId('track-image')).toHaveAttribute('animate', 'true');
  });

  // it('should prevent two audios playing at the same time', async () => {
  //   const toggleSpy = jest.fn();
  //   const { getAllByTestId } = renderProvider(
  //     <>
  //       <TrackCard trackId={123} previewUrl={trackUrl} onTrackToggle={toggleSpy} />
  //       <TrackCard trackId={321} previewUrl={trackUrl} onTrackToggle={toggleSpy} />
  //     </>
  //   );
  //   const trackElements = getAllByTestId(playPauseButtonId);
  //   playSpy = jest.spyOn(window.HTMLAudioElement.prototype, 'play');
  //   pauseSpy = jest.spyOn(window.HTMLAudioElement.prototype, 'pause');
  //   fireEvent.click(trackElements[0]);
  //   await waitFor(() => expect(playSpy).toHaveBeenCalledTimes(1));
  //   fireEvent.click(trackElements[1]);

  //   await waitFor(() => expect(toggleSpy).toHaveBeenCalledTimes(1));
  //   await waitFor(() => expect(pauseSpy).toHaveBeenCalledTimes(1));
  //   await waitFor(() => expect(playSpy).toHaveBeenCalledTimes(2));
  // });

  it('should set StyledImage prop "animate" back to "false" when playing audio is paused', async () => {
    const { getByTestId } = renderProvider(<TrackCard previewUrl={trackUrl} />);
    fireEvent.click(getByTestId(playPauseButtonId));
    await waitFor(() => expect(playSpy).toHaveBeenCalledTimes(1));
    expect(getByTestId('track-image')).toHaveAttribute('animate', 'true');
    fireEvent.pause(getByTestId('audio-track'));
    expect(getByTestId('track-image')).toHaveAttribute('animate', 'false');
  });

  // it('should set StyleImage prop "animate" back "false" when audio is ended', async () => {
  //   const { getByTestId } = renderProvider(<TrackCard previewUrl={trackUrl} />);
  //   fireEvent.click(getByTestId(playPauseButtonId));
  //   await waitFor(() => expect(playSpy).toHaveBeenCalledTimes(1));
  //   expect(getByTestId('track-image')).toHaveAttribute('animate', 'true');
  //   fireEvent.ended(getByTestId('audio-track'));
  //   expect(getByTestId('track-image')).toHaveAttribute('animate', 'false');
  // });
});
