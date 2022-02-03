import MockAdapter from 'axios-mock-adapter';
import { getTunes } from '@services/tunesApi';
import { getApiClient } from '@app/utils/apiUtils';

describe('tunesApi test', () => {
  let artistName;
  let mock;

  beforeAll(() => {
    artistName = 'Author C';
    mock = new MockAdapter(getApiClient('itunes').axiosInstance);
  });

  it('should make api call to /search?term=', async () => {
    const data = {
      resultCount: 1,
      results: [{ artistName }]
    };

    mock.onGet(`search?term=${artistName}`).reply(200, data);
    const res = await getTunes(artistName);
    expect(res.data).toEqual(data);
  });

  it('should fail if artistName is undefined', async () => {
    let artistName;
    const mock = new MockAdapter(getApiClient('itunes').axiosInstance);
    const problem = 'SERVER_ERROR';
    mock.onGet(`/search?term=${artistName}`).reply(500, problem);
    const res = await getTunes(artistName);
    expect(res.problem).toBe(problem);
  });
});
