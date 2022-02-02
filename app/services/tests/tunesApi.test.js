import MockAdapter from 'axios-mock-adapter';
import { getTunes } from '@services/tunesApi';
import { getApiClient } from '@app/utils/apiUtils';

describe('tunesApi test', () => {
  const artistName = 'Arijit Singh';
  it('should make api call to /search?term=', async () => {
    const mock = new MockAdapter(getApiClient('itunes').axiosInstance);
    const data = {
      resultCount: 1,
      results: [{ artistName }]
    };

    mock.onGet(`search?term=${artistName}`).reply(200, data);
    const res = await getTunes(artistName);
    expect(res.data).toEqual(data);
  });
});
