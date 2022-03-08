import { createBrowserHistory } from 'history';

export function getBaseUrl(pathname) {
  if (process.env.ENVIRONMENT_NAME === 'uat') {
    return window.location.pathname.replace('/index.html', '');
  }
  return '';
}

const history = createBrowserHistory({ basename: getBaseUrl() });
export default history;
