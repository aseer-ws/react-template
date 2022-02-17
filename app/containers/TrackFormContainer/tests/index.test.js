/**
 *
 * Tests for TrackFormContainer container
 *
 *
 */

import React from 'react';
// import { fireEvent } from '@testing-library/dom';
import { renderProvider } from '@utils/testUtils';
import { TrackFormContainerTest as TrackFormContainer } from '../index';

describe('<TrackFormContainer /> container tests', () => {
  // let submitSpy

  beforeEach(() => {
    // submitSpy = jest.fn();
  });

  it('should render and match the snapshot', () => {
    const { baseElement } = renderProvider(<TrackFormContainer />);
    expect(baseElement).toMatchSnapshot();
  });
});
