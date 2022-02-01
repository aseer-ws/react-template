import NotFound from '@containers/NotFoundPage/Loadable';
import HomeContainer from '@containers/HomeContainer/Loadable';
import TunesContainer from './containers/TunesContainer/Loadable';
import routeConstants from '@utils/routeConstants';
export const routeConfig = {
  repos: {
    component: HomeContainer,
    ...routeConstants.repos
  },
  tunes: {
    component: TunesContainer
  },
  notFoundPage: {
    component: NotFound,
    route: '/'
  }
};
