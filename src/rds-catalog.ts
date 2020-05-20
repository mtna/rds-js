import { Catalog } from '@mtna/pojo-consumer-ui';

import { AsyncResource } from './models/async/async-resource';
import { DataSetMetadata } from './models/data-set-metadata';
import { HttpResponse } from './models/http-response';
import { RdsServer } from './rds-server';
import { HttpUtil } from './utils/http';

/**
 * An instance of a RDS Catalog.
 * A basic building block to interact with a RDS API.
 * Includes methods to query catalog related information.
 *
 * @example
 * ```ts
 * const covidServer = new RdsServer('https://covid19.richdataservices.com/rds');
 * const covidCatalog = new RdsCatalog(covidServer, 'covid19');
 * covidCatalog
 *  .getMetadata()
 *  .then(
 *    res => console.log('Catalog metadata:', res.parsedBody),
 *    error => console.error('Oh no!', error)
 *  );
 * ```
 */
export interface RdsCatalog extends Catalog {}
export class RdsCatalog extends AsyncResource {
  /** The url to the RDS API  */
  get apiUrl(): string {
    return this.server.apiUrl;
  }

  /** The url for catalog related API endpoints */
  get catalogUrl(): string {
    return `${this.server.apiUrl}/api/catalog/${this.catalogId}`;
  }

  /**
   * Create a new RdsCatalog which provides
   * methods to interact with catalog-related
   * endpoints on the RDS API.
   *
   * @param server the RDS API server on which this catalog exists
   * @param catalogId the ID of this specific catalog
   * @param resolve whether to automatically start resolving all the catalog's own properties, defaults to false
   */
  constructor(protected readonly server: RdsServer, public readonly catalogId: string, resolve = false) {
    super(resolve);
  }

  /**
   * Get catalog metadata.
   * This will retrieve the metadata for all of the data products
   * that are in the specified catalog. For each data product there
   * will be a record layout with its variables along with any
   * classifications that are referenced by the variables.
   *
   * @returns metadata about the specified catalog
   */
  async getMetadata(): Promise<HttpResponse<DataSetMetadata>> {
    return HttpUtil.get<DataSetMetadata>(`${this.catalogUrl}/metadata`);
  }

  /**
   * Resolve this catalog.
   * This allows a more specific view of a catalog and
   * its data products, it is a subset of the root catalog
   * and holds no additional information to what can be
   * found in the broader get catalog endpoint.
   *
   * @returns a promise that completes once the catalog is resolved
   */
  async resolve(): Promise<void> {
    this.setResolving(true);
    return new Promise<void>((resolve, reject) => {
      HttpUtil.get<Catalog>(`${this.catalogUrl}`)
        .then((res: HttpResponse<Catalog>) => {
          if (res?.parsedBody) {
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
}
