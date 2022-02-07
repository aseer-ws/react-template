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
    const problem = 'SERVER_ERROR';
    mock.onGet(`/search?term=${artistName}`).reply(500, problem);
    const res = await getTunes(artistName);
    expect(res.problem).toBe(problem);
  });

  it('should fetch track details for given trackId', async () => {
    const trackId = 966411602;
    const data = {
      resultCount: 1,
      results: [{ trackId }]
    };
    mock.onGet(`/search?term=${trackId}`).reply(200, data);
    const res = await getTunes(trackId);
    expect(res.data).toEqual(data);
  });
});
