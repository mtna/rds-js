import fetchMock from 'jest-fetch-mock';

import { RdsCatalog } from './rds-catalog';
import { RdsDataProduct } from './rds-data-product';
import { RdsServer } from './rds-server';
import { HttpUtil } from './utils/http';

describe('RdsCatalog', () => {
  const COVID_API_URL = 'https://covid19.richdataservices.com/rds';
  const CATALOG_ID = 'int';
  const server = new RdsServer(COVID_API_URL);

  it('can instantiate', () => {
    expect(new RdsCatalog(server, CATALOG_ID)).toBeInstanceOf(RdsCatalog);
  });

  describe('Constructor', () => {
    const catalog = new RdsCatalog(server, CATALOG_ID);
    it('should set the api url', () => {
      expect(catalog.apiUrl).toEqual(COVID_API_URL);
    });

    it('should set the catalog url', () => {
      expect(catalog.catalogUrl).toEqual(`${COVID_API_URL}/api/catalog/${CATALOG_ID}`);
    });
  });

  describe('Get data product', () => {
    it(`should create and return a new RdsDataProduct`, () => {
      expect(new RdsCatalog(server, CATALOG_ID).getDataProduct('')).toBeInstanceOf(RdsDataProduct);
    });
  });

  describe('Get metadata', () => {
    it(`should make an api request to ${COVID_API_URL}/api/catalog/{CATALOG_ID}/metadata`, () => {
      const spy = jest.spyOn(HttpUtil, 'get').mockImplementation();
      const catalog = new RdsCatalog(server, CATALOG_ID);
      expect.assertions(2);
      return catalog.getMetadata().then(() => {
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(`${COVID_API_URL}/api/catalog/${CATALOG_ID}/metadata`);
        spy.mockRestore();
      });
    });
  });

  describe(`Resolve the catalog's properties`, () => {
    let catalog: RdsCatalog;
    beforeEach(() => {
      catalog = new RdsCatalog(server, CATALOG_ID);
    });
    it(`should set resolving to true before calling the api`, () => {
      expect.assertions(1);
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
    it(`should set resolving to false once the api request completes`, () => {
      const spy = jest.spyOn(HttpUtil, 'get').mockImplementation(() => new Promise(resolve => resolve()));
      expect.assertions(1);
      return catalog.resolve().then(() => {
        expect(catalog.isResolving()).toBe(false);
        spy.mockRestore();
      });
    });
    it(`should set resolved to true when the api request completes sucessfully`, () => {
      const spy = jest.spyOn(HttpUtil, 'get').mockImplementation(() => new Promise(resolve => resolve()));
      expect.assertions(2);
      expect(catalog.isResolved()).toBe(false);
      return catalog.resolve().then(() => {
        expect(catalog.isResolved()).toBe(true);
        spy.mockRestore();
      });
    });
    it(`should set the catalog's properties once the api request completes sucessfully`, () => {
      fetchMock.mockOnce(JSON.stringify({ catalogCount: 10 }));
      expect.assertions(1);
      return catalog.resolve().then(() => {
        expect(catalog.catalogCount).toBe(10);
      });
    });
    it(`should throw an error when the api request fails`, () => {
      const fakeError = new Error('fake error message');
      fetchMock.mockRejectOnce(fakeError);
      expect.assertions(1);
      return catalog.resolve().catch(e => {
        expect(e).toEqual(fakeError);
      });
    });
  });
});
