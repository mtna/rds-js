import { RdsServer } from './rds-server';
import { HttpUtil } from './utils/http';

describe('RdsServer', () => {
  const COVID_API_URL = 'https://covid19.richdataservices.com/rds';

  it('can instantiate', () => {
    expect(new RdsServer(COVID_API_URL)).toBeInstanceOf(RdsServer);
  });

  it('can instantiate via factory method', () => {
    expect(RdsServer.fromUrlParts('https', 'covis19.richdataservices.com', '/rds')).toBeInstanceOf(RdsServer);
  });

  describe('Setup api url', () => {
    it('When constructed, the api url should be set', () => {
      const server = new RdsServer(COVID_API_URL);
      expect(server.apiUrl).toEqual(COVID_API_URL);
    });

    it('When constructed, the url should be parsed into partials', () => {
      const server = new RdsServer(COVID_API_URL);
      expect(server.parsedUrl).toBeDefined();
      expect(server.parsedUrl.protocol).toEqual('https');
      expect(server.parsedUrl.host).toEqual('covid19.richdataservices.com');
      expect(server.parsedUrl.path).toEqual('/rds');
    });

    it('When constructed, then trailing slashes should be removed from the url', () => {
      const server = new RdsServer(`${COVID_API_URL}/`);
      expect(server.parsedUrl.source).toEqual(COVID_API_URL);
      expect(server.apiUrl).toEqual(COVID_API_URL);
    });
  });

  describe('Get changelog', () => {
    it('When called, then the api url should be /api/server/changelog', () => {
      const spy = jest.spyOn(HttpUtil, 'get').mockImplementation();
      const server = new RdsServer(COVID_API_URL);
      return server.getChangelog().then(() => {
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(`${COVID_API_URL}/api/server/changelog`);
        spy.mockRestore();
      });
    });
  });

  describe('Get info', () => {
    it('When called, then the api url should be /api/server/info', () => {
      const spy = jest.spyOn(HttpUtil, 'get').mockImplementation();
      const server = new RdsServer(COVID_API_URL);
      return server.getInfo().then(() => {
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(`${COVID_API_URL}/api/server/info`);
        spy.mockRestore();
      });
    });
  });

  describe('Get root catalog', () => {
    it('When called, then the api url should be /api/catalog', () => {
      const spy = jest.spyOn(HttpUtil, 'get').mockImplementation();
      const server = new RdsServer(COVID_API_URL);
      return server.getRootCatalog().then(() => {
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(`${COVID_API_URL}/api/catalog`);
        spy.mockRestore();
      });
    });
  });
});
