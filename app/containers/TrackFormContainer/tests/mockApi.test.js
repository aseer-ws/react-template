import uploadTrackApi, { MOCK_ERROR_MESSAGE } from '../mockApi';

describe('mockApi tests', () => {
  it('should return response 200 if random is > 0.4', async () => {
    const data = {
      data: 'some data'
    };
    const res = await uploadTrackApi(data, 0.5);
    expect(res.data).toEqual(data);
  });

  it('should return response 400 if random is < 0.4', async () => {
    const data = {
      data: 'some error'
    };
    const res = await uploadTrackApi(data, 0.2);
    expect(res.data).toBe(MOCK_ERROR_MESSAGE);
  });

  it('should give random statusCode if ', async () => {
    const data = {
      data: 'some error'
    };
    const res = await uploadTrackApi(data);
    expect([data, MOCK_ERROR_MESSAGE]).toContainEqual(res.data);
  });
});
