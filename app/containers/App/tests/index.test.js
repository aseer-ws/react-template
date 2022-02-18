import history from '@app/utils/history';
import { waitFor } from '@testing-library/react';
import { renderProvider, renderWithIntl, timeout } from '@utils/testUtils';
import React from 'react';
import { Router } from 'react-router-dom';
import App from '../index';

describe('<App /> container tests', () => {
  it('should render and match the snapshot', () => {
    const { container } = renderWithIntl(
      <Router history={history}>
        <App />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });

  it('should redirect value in query params redirect_uri', async () => {
    history.location.search = '?redirect_uri=/repos';
    let replaceSpy = jest.fn();
    history.replace = replaceSpy;
    renderProvider(
      <Router history={history}>
        <App />
      </Router>
    );
    await timeout(500);
    await waitFor(() => expect(replaceSpy).toBeCalledWith('/repos'));
  });
});
