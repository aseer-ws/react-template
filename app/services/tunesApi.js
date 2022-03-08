import { generateApiClient } from '@utils/apiUtils';
import { create } from 'apisauce';
import MockAdapter from 'axios-mock-adapter';

/** @type {import('apisauce').ApisauceInstance} */
export const tunesApi = generateApiClient('itunes');

export const getTunes = (artistName) => tunesApi.get(`search?term=${artistName}`);

export const submitTuneApi = create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' }
});

const mock = new MockAdapter(submitTuneApi.axiosInstance);

export const MOCK_ERROR_MESSAGE = 'Unable to upload track';

export function submitTune(trackDetails, random = Math.random()) {
  let statusCode = random > 0.4 ? 200 : 400;
  if (typeof process !== 'undefined' && process.env.TEST_MOCK_STATUS_CODE) {
    statusCode = Number(process.env.TEST_MOCK_STATUS_CODE);
  }
  const reponseData = statusCode === 200 ? trackDetails : MOCK_ERROR_MESSAGE;
  mock.reset();
  mock.onGet('todos', trackDetails).reply(statusCode, reponseData);
  return submitTuneApi.get('todos', trackDetails, { headers: { 'Content-Type': 'application/json' } });
}
