import fetchMock from 'jest-fetch-mock';

import { RdsCatalog } from './rds-catalog';
import { RdsDataProduct } from './rds-data-product';
import { RdsServer } from './rds-server';
import { HttpUtil } from './utils/http';

describe('RdsDataProduct', () => {
  const COVID_API_URL = 'https://covid19.richdataservices.com/rds';
  const CATALOG_ID = 'int';
  const DATA_PRODUCT_ID = 'jhu_country';
  const server = new RdsServer(COVID_API_URL);
  const catalog = new RdsCatalog(server, CATALOG_ID);

  it('can instantiate', () => {
    expect(new RdsDataProduct(catalog, DATA_PRODUCT_ID)).toBeInstanceOf(RdsDataProduct);
  });

  describe('Constructor', () => {
    const dataProduct = new RdsDataProduct(catalog, DATA_PRODUCT_ID);
    it('should set the api url', () => {
      expect(dataProduct.dataProductUrl).toEqual(`${COVID_API_URL}/api/catalog/${CATALOG_ID}/${DATA_PRODUCT_ID}`);
    });
    it('should set the query url', () => {
      expect(dataProduct.queryUrl).toEqual(`${COVID_API_URL}/api/query/${CATALOG_ID}/${DATA_PRODUCT_ID}`);
    });
  });

  describe('Get the record count', () => {
    it(`should make an api request to ${COVID_API_URL}/api/query/{CATALOG_ID}/{DATA_PRODUCT_ID}/count`, () => {
      const spy = jest.spyOn(HttpUtil, 'get').mockImplementation();
      const dataProduct = new RdsDataProduct(catalog, DATA_PRODUCT_ID);
      expect.assertions(2);
      return dataProduct.count().then(() => {
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(`${COVID_API_URL}/api/query/${CATALOG_ID}/${DATA_PRODUCT_ID}/count`);
        spy.mockRestore();
      });
    });
  });

  describe('Run a select query', () => {
    it(`should make an api request to ${COVID_API_URL}/api/query/{CATALOG_ID}/{DATA_PRODUCT_ID}/select?`, () => {
      const spy = jest.spyOn(HttpUtil, 'get').mockImplementation();
      const dataProduct = new RdsDataProduct(catalog, DATA_PRODUCT_ID);
      expect.assertions(2);
      return dataProduct.select().then(() => {
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(`${COVID_API_URL}/api/query/${CATALOG_ID}/${DATA_PRODUCT_ID}/select?`);
        spy.mockRestore();
      });
    });
  });

  describe('Run a tabulation', () => {
    it(`should make an api request to ${COVID_API_URL}/api/query/{CATALOG_ID}/{DATA_PRODUCT_ID}/tabulate?`, () => {
      const spy = jest.spyOn(HttpUtil, 'get').mockImplementation();
      const dataProduct = new RdsDataProduct(catalog, DATA_PRODUCT_ID);
      expect.assertions(2);
      return dataProduct.tabulate().then(() => {
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(`${COVID_API_URL}/api/query/${CATALOG_ID}/${DATA_PRODUCT_ID}/tabulate?`);
        spy.mockRestore();
      });
    });
  });

  describe(`Resolve the data product's properties`, () => {
    let dataProduct: RdsDataProduct;
    beforeEach(() => {
      dataProduct = new RdsDataProduct(catalog, DATA_PRODUCT_ID);
    });

    it(`should set resolving to true before calling the api`, () => {
      expect.assertions(1);
      const spy = jest.spyOn(HttpUtil, 'get').mockImplementation(
        () =>
          new Promise(resolve => {
            expect(dataProduct.isResolving()).toBe(true);
            resolve();
          })
      );
      return dataProduct.resolve().then(() => {
        spy.mockRestore();
      });
    });
    it(`should set resolving to false once the api request completes`, () => {
      const spy = jest.spyOn(HttpUtil, 'get').mockImplementation(() => new Promise(resolve => resolve()));
      expect.assertions(1);
      return dataProduct.resolve().then(() => {
        expect(dataProduct.isResolving()).toBe(false);
        spy.mockRestore();
      });
    });
    it(`should set resolved to true when the api request completes sucessfully`, () => {
      const spy = jest.spyOn(HttpUtil, 'get').mockImplementation(() => new Promise(resolve => resolve()));
      expect.assertions(2);
      expect(dataProduct.isResolved()).toBe(false);
      return dataProduct.resolve().then(() => {
        expect(dataProduct.isResolved()).toBe(true);
        spy.mockRestore();
      });
    });
    it(`should set the data product's properties once the api request completes sucessfully`, () => {
      fetchMock.mockOnce(JSON.stringify({ description: 'fake description' }));
      expect.assertions(1);
      return dataProduct.resolve().then(() => {
        expect(dataProduct.description).toBe('fake description');
      });
    });
    it(`should throw an error when the api request fails`, () => {
      const fakeError = new Error('fake error message');
      fetchMock.mockRejectOnce(fakeError);
      expect.assertions(1);
      return dataProduct.resolve().catch(e => {
        expect(e).toEqual(fakeError);
      });
    });
  });
});
