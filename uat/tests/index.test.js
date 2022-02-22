import { detectRedirect } from '..';

describe('UAT script tests', () => {
  beforeAll(() => {
    delete window.location;
    window.location = {
      pathname: '/',
      origin: 'http://localhost',
      assign: jest.fn()
    };
    delete global.fetch;
    global.fetch = jest.fn((url) => {
      let pathname = url.replace(window.location.origin, '');
      if (pathname === '/feat/spa') {
        return Promise.resolve({ ok: true });
      }
      return Promise.resolve({ ok: false });
    });
  });

  it('should redirect to spa page', async () => {
    window.location.pathname = '/feat/spa/random/123';
    await detectRedirect();
    expect(window.location.assign).toBeCalledWith(
      window.location.origin + '/feat/spa/index.html?redirect_uri=/random/123'
    );
  });

  it("should not redirect if pathname is '/'", async () => {
    window.location.pathname = '/';
    await detectRedirect();
    expect(window.location.assign).toBeCalledWith(window.location.origin + '/index.html');
  });

  it("should redirect back to index.html if path couldn't spa file in other route", async () => {
    window.location.pathname = '/some/random/place';
    await detectRedirect();
    expect(window.location.assign).toBeCalledWith(window.location.origin + '/index.html');
  });
});
