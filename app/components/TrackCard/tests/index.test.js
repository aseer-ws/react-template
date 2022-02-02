import React from 'react';
import TrackCard from '..';
import { renderWithIntl } from '@app/utils/testUtils';

describe('TrackCard tests', () => {
  it('should match the screenshot', () => {});

  it('should render to the screen without props', () => {
    const { getByTestId } = renderWithIntl(<TrackCard />);
    expect(getByTestId('track-card')).toBeInTheDocument();
  });

  it('should render to the screen with content', () => {
    const trackName = 'Show me the meaning';
    const artworkUrl100 = 'https://testimages.org/img/testimages_screenshot.jpg';
    const collectionName = 'Backstreet Boys';
    const trackPrice = 3.1;
    const primaryGenre = 'Pop';
    const trackCardProps = {
      trackName,
      artworkUrl100,
      collectionName,
      trackPrice,
      primaryGenre
    };

    const { getByTestId } = renderWithIntl(<TrackCard {...trackCardProps} />);

    expect(getByTestId('track-name')).toHaveTextContent(trackName);
    expect(getByTestId('collection-name')).toHaveTextContent(collectionName);
    expect(getByTestId('track-price')).toHaveTextContent(trackPrice);
    expect(getByTestId('track-genre')).toHaveTextContent(primaryGenre);
  });
});
