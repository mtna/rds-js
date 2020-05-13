/**
 * Singleton class that holds the RDS API server information.
 * Initialization required in order to use the sdk.
 */
export class RdsServer {
  private static instance: RdsServer;

  /** @returns the RDS API url */
  get apiUrl(): string {
    return `${this.protocol}${this.domain}${this.port ? ':' + this.port : ''}${this.path}/api`;
  }

  private constructor(private protocol: string, private domain: string, private port: string | undefined, private path: string) {}

  public static getInstance(): RdsServer {
    if (!RdsServer.instance) {
      throw new Error('RdsServer has not been initialized. You must call init before getting the instance.');
    }

    return RdsServer.instance;
  }

  /**
   * Initialize the RDS server once to configure where the RDS API instance is hosted.
   *
   * @param protocol The protocol used on the site the RDS API is hosted, defaults to 'https://'
   * @param domain The domain under which the RDS API is hosted, defaults to 'covid19.richdataservices.com'
   * @param port Optional port where the RDS API is hosted, or undefined if not applicable
   * @param path The path where the RDS API is hosted, defaults to '/rds'
   * @returns the initialized `RdsServer` instance.
   */
  public static init(protocol = 'https://', domain = 'covid19.richdataservices.com', port?: string | undefined, path = '/rds'): RdsServer {
    if (RdsServer.instance) {
      throw new Error('The RdsServer can only be initialized once.');
    }

    RdsServer.instance = new RdsServer(protocol, domain, port, path);

    return RdsServer.instance;
  }
}
