import { generateApiClient } from '@utils/apiUtils';
export const tunesApi = generateApiClient('itunes');

export const getTunes = (artistName) => tunesApi.get(`search?term=${artistName}`);
