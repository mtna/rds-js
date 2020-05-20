import fetchMock from 'jest-fetch-mock';

import { RdsCatalog } from './rds-catalog';
import { RdsServer } from './rds-server';
import { HttpUtil } from './utils/http';

describe('RdsCatalog', () => {
  const COVID_API_URL = 'https://covid19.richdataservices.com/rds';
  const CATALOG_ID = 'covid19';
  const server = new RdsServer(COVID_API_URL);

  it('can instantiate', () => {
    expect(new RdsCatalog(server, CATALOG_ID)).toBeInstanceOf(RdsCatalog);
  });

  describe('Setup api url', () => {
    it('When constructed, the api url should be set', () => {
      const catalog = new RdsCatalog(server, CATALOG_ID);
      expect(catalog.apiUrl).toEqual(COVID_API_URL);
    });

    it('When constructed, the catalog url should be set', () => {
      const catalog = new RdsCatalog(server, CATALOG_ID);
      expect(catalog.catalogUrl).toEqual(`${COVID_API_URL}/api/catalog/${CATALOG_ID}`);
    });
  });

  describe('Get metadata', () => {
    it(`When called on the "${CATALOG_ID}" catalog, then the api url should be /api/catalog/${CATALOG_ID}/metadata`, () => {
      const spy = jest.spyOn(HttpUtil, 'get').mockImplementation();
      const catalog = new RdsCatalog(server, CATALOG_ID);
      return catalog.getMetadata().then(() => {
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(`${COVID_API_URL}/api/catalog/${CATALOG_ID}/metadata`);
        spy.mockRestore();
      });
    });
  });

  describe(`Resolve the catalog's properties`, () => {
    it(`When called, then resolving should be set to true`, () => {
      const catalog = new RdsCatalog(server, CATALOG_ID);
      const spy = jest.spyOn(HttpUtil, 'get').mockImplementation(
        () =>
          new Promise(resolve => {
            expect(catalog.isResolving()).toBe(true);
            resolve();
          })
      );
      return catalog.resolve().then(() => {
        spy.mockRestore();
      });
    });
    it(`When the resolution completes, then resolving should be set to false`, () => {
      const catalog = new RdsCatalog(server, CATALOG_ID);
      const spy = jest.spyOn(HttpUtil, 'get').mockImplementation(() => new Promise(resolve => resolve()));
      return catalog.resolve().then(() => {
        expect(catalog.isResolving()).toBe(false);
        spy.mockRestore();
      });
    });
    it(`When the resolution completes, then it should be marked as resolved`, () => {
      const catalog = new RdsCatalog(server, CATALOG_ID);
      const spy = jest.spyOn(HttpUtil, 'get').mockImplementation(() => new Promise(resolve => resolve()));
      expect(catalog.isResolved()).toBe(false);
      return catalog.resolve().then(() => {
        expect(catalog.isResolved()).toBe(true);
        spy.mockRestore();
      });
    });
    it(`When the resolution completes, then the catalog's properties should be set`, () => {
      fetchMock.mockOnce(JSON.stringify({ catalogCount: 10 }));
      const catalog = new RdsCatalog(server, CATALOG_ID);
      return catalog.resolve().then(() => {
        expect(catalog.catalogCount).toBe(10);
      });
    });
    it(`When the resolution fails, then an error should be thrown`, () => {
      const fakeError = new Error('fake error message');
      fetchMock.mockRejectOnce(fakeError);
      const catalog = new RdsCatalog(server, CATALOG_ID);
      expect.assertions(1);
      return catalog.resolve().catch(e => {
        expect(e).toEqual(fakeError);
      });
    });
  });
});
