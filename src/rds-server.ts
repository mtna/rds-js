import { RdsVersion } from './models/server';
import { ServerInformation } from './models/server/information';
import { HttpResponse, HttpUtil } from './utils/http';

/**
 * An instance of a RDS API server.
 * A basic building block to interact with a RDS API.
 * Includes methods to query server-level information.
 *
 * @example
 * ```ts
 * const covidServer = new RdsServer('https://covid19.richdataservices.com/rds/api');
 * covidServer
 *  .getInfo()
 *  .then((res: HttpResponse<ServerInformation>) =>
 *    { console.log('Server info:', res.parsedBody); }
 *  );
 * ```
 */
export class RdsServer {
  /** The url to the RDS API */
  readonly apiUrl: string;

  /** The url for the server related API endpoints */
  get serverUrl(): string {
    return `${this.apiUrl}/server`;
  }

  /**
   * Create a new instance of a RDS API Server.
   * @param url The URL to the RDS API, i.e. `https://covid19.richdataservices.com/rds/api`
   */
  constructor(url: string) {
    // Remove any trailing slashes
    this.apiUrl = url.replace(/\/+$/, '');
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
   * Get changelog.
   * Shows the change log of RDS providing version information about
   * additions, changes, deprecations, fixed bugs, removals, and security enhancements.
   *
   * @returns an array of information about each version and the changes between them.
   */
  async getChangelog(): Promise<HttpResponse<RdsVersion[]>> {
    return HttpUtil.get<RdsVersion[]>(`${this.serverUrl}/changelog`);
  }
}
