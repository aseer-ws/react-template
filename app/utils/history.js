import { createBrowserHistory } from 'history';
import { matchPath } from 'react-router';
import routeConstants from './routeConstants';

const routes = Object.keys(routeConstants);

export function getBaseUrl(pathname) {
  let baseURL = undefined;

  if (process.env.ENVIRONMENT_NAME === 'uat') {
    routes.forEach((routeKey) => {
      const route = routeConstants[routeKey].route;
      if (pathname.includes(route)) {
        // console.log('inside not : ->', { baseURL });
        if (pathname.substring(pathname.length - route.length, pathname.length) === route) {
          // console.log('matching here');
          baseURL = pathname.substring(0, pathname.length - route.length);
        }
        if (pathname.substring(pathname.length - route.length, pathname.length - 1) === `${route}/`) {
          baseURL = pathname.substring(0, pathname.length - route.length - 1);
        }
      } else {
        if (route.includes(':')) {
          // console.log('inside : ->', { baseURL });
          const regex = /^(?!:)\/[\w]+/;
          const matches = regex.exec(route);
          if (!matches) {
            return;
          }
          let matchLastIndex = pathname.lastIndexOf(matches[0]);
          while (matchLastIndex !== -1) {
            // const matchLastIndex = pathname.lastIndexOf(matches[0]);
            const pathToMatch = pathname.substring(matchLastIndex);
            const isMatch = matchPath(pathToMatch, {
              path: route,
              exact: true
            });
            if (isMatch) {
              baseURL = pathname.substring(0, matchLastIndex);
              break;
            }
            matchLastIndex = pathname.substring(0, matchLastIndex).indexOf(matches[0]);
          }
        }
      }
    });
    if (typeof baseURL === 'undefined') {
      // console.log('made it into undefined if section');
      baseURL = pathname;
    }
  }

  return baseURL ?? '';
}

// [DONE] http://localhost:3000/directory/ <-> '/'
// [DONE] http://localhost:3000/directory/tracks <-> '/tracks'
// [TODO] http://localhost:3000/directory <-> ''
// [DONE] http://localhost:3000/directory/tracks/123 <-> '/tracks/:trackId'
// [DONE] http://localhost:3000/directory/artist/321/tracks/123 <-> '/artist/:artistId/tracks/:trackId'
// [DONE] directory === feat/itunes
// [DONE] directory === feat/tracks

const history = createBrowserHistory({ basename: getBaseUrl(window.location.pathname) });
export default history;
