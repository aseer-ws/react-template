import { createBrowserHistory } from 'history';
export const baseUrl = () => process.env.PUBLIC_PATH || '/';
const history = createBrowserHistory({ basename: baseUrl() });
export default history;
