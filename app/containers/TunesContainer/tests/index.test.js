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
});
