import { generateApiClient } from '@utils/apiUtils';
const tunesApi = generateApiClient('itunes');

export const getTunes = (artistName) => tunesApi.get(`search?term=${artistName}`);
