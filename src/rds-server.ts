import { Catalog } from '@mtna/pojo-consumer-ui';

import { HttpResponse } from './models/http-response';
import { ParsedUrl } from './models/parsed-url';
import { RdsVersion } from './models/server';
import { ServerInformation } from './models/server/information';
import { RdsCatalog } from './rds-catalog';
import { HttpUtil } from './utils/http';
import { _parseUrl } from './utils/url-parser';

/**
 * An instance of a RDS API server.
 * A basic building block to interact with a RDS API.
 * Includes methods to query server-level information.
 *
 * @example
 * ```ts
 * const covidServer = new RdsServer('https://covid19.richdataservices.com/rds');
 * covidServer
 *  .getInfo()
 *  .then((res: HttpResponse<ServerInformation>) =>
 *    { console.log('Server info:', res.parsedBody); }
 *  );
 * ```
 */
export class RdsServer {
  /**
   * Factory method for instantiating an RdsServer
   * from the individual url parts.
   *
   * @example
   * ```ts
   * const server = RdsServer.fromUrlParts('https://','covid19.richdataservices.com', '/rds');
   * ```
   *
   * @param protocol The protocol used on the site the RDS API is hosted, defaults to 'https'
   * @param domain The domain under which the RDS API is hosted, i.e. 'covid19.richdataservices.com'
   * @param path The path where the RDS API is hosted, defaults to '/rds'
   * @param port Optional port where the RDS API is hosted, or undefined if not applicable
   *
   * @returns a new RdsServer
   */
  static fromUrlParts(protocol = 'https', domain: string, path = '/rds', port?: string | undefined): RdsServer {
    return new this(`${protocol}://${domain}${port ? ':' + port : ''}${path}`);
  }

  /** The base url to the RDS API, i.e. `https://covid19.richdataservices.com/rds` */
  readonly apiUrl: string;
  /** The url parsed out into its partials */
  readonly parsedUrl: ParsedUrl;

  /** The url for the server related API endpoints */
  get serverUrl(): string {
    return `${this.apiUrl}/api/server`;
  }

  /**
   * Create a new instance of a RDS API Server.
   * @param url The full URL to the RDS API, i.e. `https://covid19.richdataservices.com/rds`
   */
  constructor(url: string) {
    // Remove any trailing slashes
    // and parse url
    this.parsedUrl = _parseUrl(url.replace(/\/+$/, ''));
    // Construct the api url
    this.apiUrl = `${this.parsedUrl.protocol}://${this.parsedUrl.host}${this.parsedUrl.port ? ':' + this.parsedUrl.port : ''}${
      this.parsedUrl.path
    }`;
  }

  /**
   * Create and get an instance of a RDS Catalog that exists on
   * this RdsServer. This is a convenience method, these two code snippets
   * are equivalent:
   * ```ts
   * const catalog = new RdsServer('https://covid19.richdataservices.com/rds')
   *                  .getCatalog('covid19');
   * ```
   * and
   * ```ts
   * const server = new RdsServer('https://covid19.richdataservices.com/rds');
   * const catalog = new RdsCatalog(server, 'covid19');
   * ```
   * @param catalogId the ID of the specific catalog
   * @param resolve whether to automatically start resolving all the catalog's own properties, defaults to false
   * @returns a new RdsCatalog
   */
  getCatalog(catalogId: string, resolve = false): RdsCatalog {
    return new RdsCatalog(this, catalogId, resolve);
  }

  /**
   * Get changelog.
   * Shows the change log of RDS providing version information about
   * additions, changes, deprecations, fixed bugs, removals, and security enhancements.
   *
   * @returns an array of information about each version and the changes between them.
   */
  async getChangelog(): Promise<HttpResponse<RdsVersion[]>> {
    return HttpUtil.get<RdsVersion[]>(`${this.serverUrl}/changelog`);
  }

  /**
   * Get server information.
   * Provides the server information for RDS.
   *
   * @returns information about the RDS Server
   */
  async getInfo(): Promise<HttpResponse<ServerInformation>> {
    return HttpUtil.get<ServerInformation>(`${this.serverUrl}/info`);
  }

  /**
   * Get the root catalog of the system.
   * This will hold a list of all the catalogs and data products
   * that are available on this server. This would ideally be
   * used to power an entry point into an application.
   * The catalog provides a starting point for users to view
   * what is available to them and drill down into a catalog
   * or data product of their interest. The catalogs and products
   * may have descriptive metadata on them that is useful to display.
   *
   * @returns the root catalog of the RDS server
   */
  async getRootCatalog(): Promise<HttpResponse<Catalog>> {
    return HttpUtil.get<Catalog>(`${this.apiUrl}/api/catalog`);
  }
}
