import { createBrowserHistory } from 'history';
import { matchPath } from 'react-router';
import routeConstants from './routeConstants';

const routes = Object.keys(routeConstants);

export function findCommonRoutePrefix(routeArr) {
  let maxCommon = routeArr[0];
  for (let i = 1; i < routeArr.length - 1; i++) {
    const loopCount = routeArr[i].length > maxCommon.length ? maxCommon.length : routeArr[i + 1].length;
    stringLoop: for (let j = 0; j < loopCount; j++) {
      if (maxCommon[j] !== routeArr[i][j]) {
        maxCommon = routeArr[i + 1].substring(0, j);
        break stringLoop;
      }
    }
  }
  return maxCommon;
}

export function getBaseUrl(pathname) {
  let baseURLCollection = [];

  if (process.env.ENVIRONMENT_NAME === 'uat') {
    routes.forEach((routeKey) => {
      const route = routeConstants[routeKey].route;
      if (pathname.includes(route)) {
        // console.log('inside not : ->', { baseURL });
        if (pathname.substring(pathname.length - route.length, pathname.length) === route) {
          // console.log('matching here');
          baseURLCollection.push(pathname.substring(0, pathname.length - route.length));
        }
        if (pathname.substring(pathname.length - route.length - 1, pathname.length) === `${route}/`) {
          baseURLCollection.push(pathname.substring(0, pathname.length - route.length - 1));
        }
      } else {
        if (route.includes(':')) {
          // console.log('inside : ->', { baseURL });
          const regex = /^(?!:)\/[\w]+/;
          const matches = regex.exec(route);

          let matchLastIndex = pathname.lastIndexOf(matches[0]);
          // const matchLastIndex = pathname.lastIndexOf(matches[0]);
          const pathToMatch = pathname.substring(matchLastIndex);
          const isMatch = matchPath(pathToMatch, {
            path: route,
            exact: true
          });
          if (isMatch) {
            baseURLCollection.push(pathname.substring(0, matchLastIndex));
          }
        }
      }
    });
    if (!baseURLCollection.length) {
      // console.log('made it into undefined if section');
      return pathname;
    }
    return findCommonRoutePrefix(baseURLCollection);
  }
  return '';
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
