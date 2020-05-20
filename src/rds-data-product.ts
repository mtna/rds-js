import { DataProduct } from '@mtna/pojo-consumer-ui';

import { AsyncResource } from './models/async/async-resource';
import { FormattedDataSet } from './models/datasets/formatted';
import { HttpResponse } from './models/http-response';
import { RdsSelectParameters } from './models/parameters/select';
import { RdsTabulateParameters } from './models/parameters/tabulate';
import { RdsCatalog } from './rds-catalog';
import { HttpUtil } from './utils/http';
import { serializeRdsParameters } from './utils/url-serializers';

/**
 * An instance of a RDS Data Product.
 * A basic building block to interact with a RDS API.
 * Includes methods to query data product related information.
 *
 * @example
 * ```ts
 * const covidServer = new RdsServer('https://covid19.richdataservices.com/rds');
 * const covidCatalog = new RdsCatalog(covidServer, 'covid19');
 * const dataProduct = new RdsDataProduct(covidCatalog, 'us_jhu_ccse_country');
 * dataProduct
 *  .select()
 *  .then(
 *    res => console.log('Data:', res.parsedBody),
 *    error => console.error('Oh no!', error)
 *  );
 * ```
 */
export interface RdsDataProduct extends DataProduct {}
export class RdsDataProduct extends AsyncResource {
  /** The url for data product related API endpoints. */
  get dataProductUrl(): string {
    return `${this.catalog.catalogUrl}/${this.dataProductId}`;
  }

  /** The url for query related API endpoints for this specific data product. */
  get queryUrl(): string {
    return `${this.catalog.apiUrl}/api/query/${this.catalog.catalogId}/${this.dataProductId}`;
  }

  /**
   * Create a new RdsDataProduct which provides
   * methods to interact with data product related
   * endpoints on the RDS API.
   *
   * @param catalog the RDS Catalog on which this data product exists
   * @param dataProductId the ID of this specific data product
   * @param resolve whether to automatically start resolving all the data products's own properties, defaults to false
   */
  constructor(protected readonly catalog: RdsCatalog, public readonly dataProductId: string, resolve = false) {
    super(resolve);
  }

  /**
   * Get data product.
   * This shows a single data product in a catalog, there is no
   * additional information in this call, it simply limits the
   * scope of what is returned.
   *
   * @returns a promise that completes once the data product is resolved
   */
  async resolve(): Promise<void> {
    this.setResolving(true);
    return new Promise<void>((resolve, reject) => {
      HttpUtil.get<DataProduct>(`${this.dataProductUrl}`)
        .then((res: HttpResponse<DataProduct>) => {
          if (res.parsedBody) {
            // Assign all properties from the api response to this resource
            Object.assign(this, res.parsedBody);
          }
          this.setResolved(true);
          resolve();
        })
        .finally(() => this.setResolving(false))
        .catch(error => reject(error));
    });
  }

  //#region  QUERY ENDPOINTS

  /**
   * Get record count.
   * Runs a query to count the records of the specified data product.
   *
   * @returns the number of records within the data product.
   */
  async count(): Promise<HttpResponse<number>> {
    return HttpUtil.get<number>(`${this.queryUrl}/${this.catalog.catalogId}/${this.dataProductId}/count`);
  }

  /**
   * Run select query.
   * Running a select query on the specified data product returns record level microdata.
   * A variety of querying techniques can be used to subset, compute, order, filter and format the results.
   *
   * @param parameters Optional parameters for an RDS select query
   * @returns Record level microdata, the shape will vary depending on the `format` query paramter.
   */
  async select<DS extends FormattedDataSet>(parameters?: RdsSelectParameters): Promise<HttpResponse<DS>> {
    return HttpUtil.get<DS>(
      `${this.queryUrl}/${this.catalog.catalogId}/${this.dataProductId}/select?${serializeRdsParameters(parameters)}`
    );
  }

  /**
   * Run tabulation query.
   * Running tabulations on the specified data product returns
   * aggregate level data about the dimensions and measures specified.
   * A variety of querying techniques can be used to subset, compute, order, filter and format the results.
   *
   * @param parameters Optional parameters for an RDS tabulate query
   * @returns Aggregate level data about the dimensions and measures specified.
   * The shape will vary depending on the `format` query paramter.
   */
  async tabulate<DS extends FormattedDataSet>(parameters?: RdsTabulateParameters): Promise<HttpResponse<DS>> {
    return HttpUtil.get<DS>(
      `${this.queryUrl}/${this.catalog.catalogId}/${this.dataProductId}/tabulate?${serializeRdsParameters(parameters)}`
    );
  }

  //#endregion  QUERY ENDPOINTS
}
