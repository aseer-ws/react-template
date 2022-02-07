import { translate } from '@app/components/IntlGlobalProvider';
import { renderProvider } from '@app/utils/testUtils';
import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import TrackCard from '..';

function createAudioStub(event = 'play') {
  return jest.spyOn(HTMLMediaElement.prototype, event);
}

describe('<TrackCard /> tests', () => {
  let trackUrl;
  let playPauseButtonId;
  let trackPlayStub;
  let trackStopStub;

  beforeAll(() => {
    trackUrl =
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/fb/55/23/fb552336-6b1f-99d7-31b0-55fa6f1796e1/mzaf_11062059991207198732.plus.aac.p.m4a';
    playPauseButtonId = 'play-pause-btn';
    trackPlayStub = createAudioStub('play').mockImplementation(() => {});
    trackStopStub = createAudioStub('pause');
  });

  afterEach(() => {
    trackPlayStub?.mockReset();
    trackStopStub?.mockReset();
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

  it('should download and play the audio if clicked on play pause button', async () => {
    const { getByTestId } = renderProvider(<TrackCard previewUrl={trackUrl} />);

    fireEvent.click(getByTestId(playPauseButtonId));
    await waitFor(() => expect(trackPlayStub).toHaveBeenCalledTimes(1));
  });

  it('should pause the already playing audio', async () => {
    const { getByTestId } = renderProvider(<TrackCard previewUrl={trackUrl} />);
    fireEvent.click(getByTestId(playPauseButtonId));
    await waitFor(() => expect(trackPlayStub).toHaveBeenCalledTimes(1));
    fireEvent.click(getByTestId(playPauseButtonId));
    await waitFor(() => expect(trackStopStub).toHaveBeenCalledTimes(1));
  });

  it('should set StyleImage "animate" to correct boolean value when audio play is toggled', async () => {
    const { getByTestId } = renderProvider(<TrackCard previewUrl={trackUrl} />);
    expect(getByTestId('track-image')).toHaveAttribute('animate', 'false');
    fireEvent.click(getByTestId(playPauseButtonId));
    await waitFor(() => expect(trackPlayStub).toHaveBeenCalledTimes(1));
    expect(getByTestId('track-image')).toHaveAttribute('animate', 'true');
  });
});
