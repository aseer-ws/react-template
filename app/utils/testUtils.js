import React from 'react';
import { IntlProvider } from 'react-intl';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { browserHistory, BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import configureStore from '@app/configureStore';
import { DEFAULT_LOCALE, translationMessages } from '@app/i18n';
import ConnectedLanguageProvider from '@containers/LanguageProvider';
import { IntlGlobalProvider } from '@components/IntlGlobalProvider';

export const renderWithIntl = (children) =>
  render(
    <IntlProvider locale={DEFAULT_LOCALE} messages={translationMessages[DEFAULT_LOCALE]}>
      <IntlGlobalProvider>{children}</IntlGlobalProvider>
    </IntlProvider>
  );

export const getComponentStyles = (Component, props = {}) => {
  renderWithIntl(Component(props));
  const { styledComponentId } = Component(props).type;
  const componentRoots = document.getElementsByClassName(styledComponentId);
  // eslint-disable-next-line no-underscore-dangle
  return window.getComputedStyle(componentRoots[0])._values;
};

export const renderProvider = (children) => {
  const store = configureStore({}, browserHistory).store;
  return render(
    <Provider store={store}>
      <ConnectedLanguageProvider messages={translationMessages}>
        <ThemeProvider
          theme={{
            main: 'violet'
          }}
        >
          <BrowserRouter>{children}</BrowserRouter>
        </ThemeProvider>
      </ConnectedLanguageProvider>
    </Provider>
  );
};
export const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const apiResponseGenerator = (ok, data, problem) => ({
  ok,
  data,
  problem
});

export const createSpyOnAudio = function (methodName, target, customImplementation = () => {}) {
  return jest.spyOn(target ?? window.HTMLAudioElement.prototype, methodName).mockImplementation(customImplementation);
};
