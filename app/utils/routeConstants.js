export default {
  repos: {
    route: '/repos',
    props: {
      maxwidth: 500,
      padding: 20
    },
    exact: true
  },
  trackGrid: {
    route: '/',
    props: {
      maxWidth: 1500,
      padding: 1
    },
    exact: true
  },
  track: {
    route: '/tracks/:trackId',
    props: {
      maxWidth: 800,
      padding: 1
    },
    exact: true
  }
};
