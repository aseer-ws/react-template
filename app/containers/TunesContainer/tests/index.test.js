/**
 *
 * Tests for TunesContainer
 *
 *
 */

import React from 'react';
import { renderProvider } from '@utils/testUtils';
// import { fireEvent } from '@testing-library/dom'
import { TunesContainerTest as TunesContainer } from '../index';

describe('<TunesContainer /> container tests', () => {
  // let submitSpy

  beforeEach(() => {
    // submitSpy = jest.fn()
  });
  it('should render and match the snapshot', () => {
    const { baseElement } = renderProvider(<TunesContainer />);
    expect(baseElement).toMatchSnapshot();
  });
});
