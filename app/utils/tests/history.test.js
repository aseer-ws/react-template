import { getBaseUrl } from '../history';

describe('history getBaseUrl tests', () => {
  beforeAll(() => {
    process.env.ENVIRONMENT_NAME = 'uat';
  });
  it("should return getBaseUrl '/' if process.env.ENVIRONMENT_NAME is undefined", () => {
    process.env.ENVIRONMENT_NAME = undefined;
    const pathname = '/tracks/321';
    expect(getBaseUrl(pathname)).toBe('');
  });

  it("should return baseURL '/test-relative-path' if process.env.ENVIRONMENT_NAME is 'uat' ", () => {
    const pathname = '/test-relative-path';
    expect(getBaseUrl(pathname)).toBe(pathname);
  });
});
