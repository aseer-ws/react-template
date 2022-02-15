import NotFound from '@containers/NotFoundPage/Loadable';
import HomeContainer from '@containers/HomeContainer/Loadable';
import TrackGridContainer from '@containers/TrackGridContainer/Loadable';
import routeConstants from '@utils/routeConstants';
import TrackContainer from '@containers/TrackContainer/Loadable';
export const routeConfig = {
  repos: {
    component: HomeContainer,
    ...routeConstants.repos
  },
  trackGrid: {
    component: TrackGridContainer,
    ...routeConstants.trackGrid
  },
  track: {
    component: TrackContainer,
    ...routeConstants.track
  },
  notFoundPage: {
    component: NotFound,
    route: '/'
  }
};
