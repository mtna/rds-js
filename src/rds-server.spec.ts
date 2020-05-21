import { RdsCatalog } from './rds-catalog';
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

  describe('Constructor', () => {
    it('should set the api url', () => {
      const server = new RdsServer(COVID_API_URL);
      expect(server.apiUrl).toEqual(COVID_API_URL);
    });

    it('should parse the url into partials', () => {
      const server = new RdsServer(COVID_API_URL);
      expect(server.parsedUrl).toBeDefined();
      expect(server.parsedUrl.protocol).toEqual('https');
      expect(server.parsedUrl.host).toEqual('covid19.richdataservices.com');
      expect(server.parsedUrl.path).toEqual('/rds');
    });

    it('should remove trailing slashes from the url', () => {
      const server = new RdsServer(`${COVID_API_URL}/`);
      expect(server.parsedUrl.source).toEqual(COVID_API_URL);
      expect(server.apiUrl).toEqual(COVID_API_URL);
    });
  });

  describe('Get catalog', () => {
    it(`should create and return a new RdsCatalog`, () => {
      expect(new RdsServer(COVID_API_URL).getCatalog('')).toBeInstanceOf(RdsCatalog);
    });
  });

  describe('Get changelog', () => {
    it(`should make an api request to ${COVID_API_URL}/api/server/changelog`, () => {
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
    it(`should make an api request to ${COVID_API_URL}/api/server/info`, () => {
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
    it(`should make an api request to ${COVID_API_URL}/api/catalog`, () => {
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
