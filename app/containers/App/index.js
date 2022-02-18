/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import GlobalStyle from '@app/global-styles';
import { routeConfig } from '@app/routeConfig';
import For from '@components/For';
import Header from '@components/Header';
import { colors } from '@themes';
import { Layout } from 'antd';
import map from 'lodash/map';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { compose } from 'redux';
import { ThemeProvider } from 'styled-components';

const theme = {
  fg: colors.primary,
  bg: colors.secondary
};

export function App({ location, history }) {
  useEffect(() => {
    if (location.search.includes('?redirect_uri=')) {
      const routeToReplace = new URLSearchParams(location.search).get('redirect_uri');
      history.replace(routeToReplace);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Layout.Content>
        <For
          ParentComponent={(props) => <Switch {...props} />}
          of={map(Object.keys(routeConfig))}
          renderItem={(routeKey, index) => {
            const Component = routeConfig[routeKey].component;
            return (
              <Route
                exact={routeConfig[routeKey].exact}
                key={index}
                path={routeConfig[routeKey].route}
                render={(props) => {
                  const updatedProps = {
                    ...props,
                    ...routeConfig[routeKey].props
                  };
                  return <Component {...updatedProps} />;
                }}
              />
            );
          }}
        />
        <GlobalStyle />
      </Layout.Content>
    </ThemeProvider>
  );
}
App.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
};
export default compose(withRouter)(App);
