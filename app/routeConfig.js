import NotFound from '@containers/NotFoundPage/Loadable';
import HomeContainer from '@containers/HomeContainer/Loadable';
import TrackGridContainer from '@containers/TrackGridContainer/Loadable';
import routeConstants from '@utils/routeConstants';
import TrackContainer from '@containers/TrackContainer/Loadable';
import TrackFormContainer from '@containers/TrackFormContainer/Loadable';

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
  trackForm: {
    component: TrackFormContainer,
    ...routeConstants.trackForm
  },
  notFoundPage: {
    component: NotFound,
    route: '/'
  }
};
