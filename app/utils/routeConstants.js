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
      maxwidth: 1500,
      padding: 1
    },
    exact: true
  },
  track: {
    route: '/tracks/:trackId',
    props: {
      maxwidth: 800,
      padding: 1
    },
    exact: true
  }
};
