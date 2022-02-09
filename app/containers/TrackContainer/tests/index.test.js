/**
 *
 * Tests for TrackContainer
 *
 *
 */

import { translate } from '@app/components/IntlGlobalProvider';
import { dateFormat, mapDispatchToProps } from '@app/containers/TrackContainer';
import { trackProviderTypes } from '@app/containers/TrackProvider/reducer';
import { renderProvider, timeout } from '@utils/testUtils';
import React from 'react';
// import { fireEvent } from '@testing-library/dom'
import { TrackContainerTest as TrackContainer } from '../index';

describe('<TrackContainer /> container tests', () => {
  let submitSpy;
  let trackInfo = {
    artistId: 466532,
    collectionId: 1165630592,
    trackId: 1165631048,
    artistName: 'Korn',
    collectionName: 'Follow The Leader',
    trackName: 'Justin',
    artistViewUrl: 'https://music.apple.com/us/artist/korn/466532?uo=4',
    collectionViewUrl: 'https://music.apple.com/us/album/justin/1165630592?i=1165631048&uo=4',
    trackViewUrl: 'https://music.apple.com/us/album/justin/1165630592?i=1165631048&uo=4',
    previewUrl:
      'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/54/57/70/545770b4-fa22-3d84-50fd-8007f97a4192/mzaf_8941792383747410636.plus.aac.p.m4a',
    artworkUrl100:
      'https://is3-ssl.mzstatic.com/image/thumb/Music125/v4/3d/9c/6b/3d9c6bdb-6572-a68d-dd5c-400c51531a71/source/100x100bb.jpg',
    trackPrice: 1.29,
    releaseDate: '1998-08-18T12:00:00Z',
    currency: 'USD',
    primaryGenreName: 'Hard Rock'
  };

  beforeEach(() => {
    submitSpy = jest.fn();
  });
  it('should render and match the snapshot', () => {
    const { baseElement } = renderProvider(<TrackContainer />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should render song info', async () => {
    const { getByTestId } = renderProvider(<TrackContainer track={{ ...trackInfo }} dispatchGetTrack={submitSpy} />);
    await timeout(200);
    expect(getByTestId('track-name')).toHaveTextContent(trackInfo.trackName);
    expect(getByTestId('artist-name')).toHaveTextContent(trackInfo.artistName);
    expect(getByTestId('collection-name')).toHaveTextContent(trackInfo.collectionName);
    expect(getByTestId('track-price')).toHaveTextContent(trackInfo.trackPrice);
    expect(getByTestId('track-genre')).toHaveTextContent(trackInfo.primaryGenreName);
    expect(getByTestId('release-date')).toHaveTextContent(dateFormat(trackInfo.releaseDate));
  });

  it('should render fallback message if no data provided', async () => {
    const { getByTestId } = renderProvider(<TrackContainer dispatchGetTrack={submitSpy} />);
    // wait for skeleton to dispappear
    await timeout(4000);
    expect(getByTestId('track_name_unavailable')).toHaveTextContent(translate('track_name_unavailable'));
    expect(getByTestId('artist_name_unavailable')).toHaveTextContent(translate('artist_name_unavailable'));
    expect(getByTestId('collection_name_unavailable')).toHaveTextContent(translate('collection_name_unavailable'));
    expect(getByTestId('track_price_unavailable')).toHaveTextContent(translate('track_price_unavailable'));
    expect(getByTestId('release_date_unavailable')).toHaveTextContent(translate('release_date_unavailable'));
    expect(getByTestId('track_genre_unavailable')).toHaveTextContent(translate('track_genre_unavailable'));
  });

  it('should mapDispatchToProps works as expected', () => {
    const props = mapDispatchToProps(submitSpy);

    const actions = {
      dispatchGetTrack: {
        type: trackProviderTypes.REQUEST_GET_TRACK,
        trackId: 123
      }
    };
    props.dispatchGetTrack(123);
    expect(submitSpy).toHaveBeenCalledWith(actions.dispatchGetTrack);
  });
});
