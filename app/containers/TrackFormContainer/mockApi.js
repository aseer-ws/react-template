import MockAdapter from 'axios-mock-adapter';
import { create } from 'apisauce';
import { timeout } from '@app/utils/testUtils';

const trackApi = create({
  baseURL: 'https://jsonplaceholder.typicode.com/',
  headers: { 'Content-Type': 'application/json' }
});

export const mock = new MockAdapter(trackApi.axiosInstance);

export const MOCK_ERROR_MESSAGE = 'Unable to upload track';

async function uploadTrackApi(trackDetails, random = Math.random()) {
  await timeout(300);
  let statusCode = random > 0.4 ? 200 : 400;
  if (typeof process !== 'undefined' && process.env.TEST_MOCK_STATUS_CODE) {
    statusCode = Number(process.env.TEST_MOCK_STATUS_CODE);
  }
  const reponseData = statusCode === 200 ? trackDetails : MOCK_ERROR_MESSAGE;
  mock.reset();
  mock.onGet('todos', trackDetails).reply(statusCode, reponseData);
  const response = await trackApi.get('todos', trackDetails, { headers: { 'Content-Type': 'application/json' } });
  return response;
}

export default uploadTrackApi;
