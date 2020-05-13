import { FormattedDataSet } from './datasets/formatted';
import { RdsSelectParameters } from './parameters/select';
import { RdsTabulateParameters } from './parameters/tabulate';
import { RdsServer } from './rds-server';
import { HttpResponse, HttpUtil } from './utils/http';
import { serializeRdsParameters } from './utils/url-serializers';

/**
 * Static functions to interact with the RDS API's QueryController endpoints.
 */
export class RdsQueryController {
  /** Base url for the RDS Query Controller */
  protected static get queryUrl(): string {
    return `${RdsServer.getInstance().apiUrl}/query`;
  }

  /**
   * Get record count.
   * Runs a query to count the records of the specified data product.
   *
   * @param catalogId The ID of the catalog that contains the data product.
   * @param dataProductId The ID of the data product to query.
   * @returns the number of records within the data product.
   */
  static async count(catalogId: string, dataProductId: string): Promise<HttpResponse<number>> {
    return HttpUtil.get<number>(`${this.queryUrl}/${catalogId}/${dataProductId}/count`);
  }

  /**
   * Run select query.
   * Running a select query on the specified data product returns record level microdata.
   * A variety of querying techniques can be used to subset, compute, order, filter and format the results.
   *
   * @param catalogId The ID of the catalog that contains the data product.
   * @param dataProductId The ID of the data product to query.
   * @param parameters Optional parameters for an RDS select query
   * @returns Record level microdata, the shape will vary depending on the `format` query paramter.
   */
  static async select<DS extends FormattedDataSet>(
    catalogId: string,
    dataProductId: string,
    parameters?: RdsSelectParameters
  ): Promise<HttpResponse<DS>> {
    return HttpUtil.get<DS>(`${this.queryUrl}/${catalogId}/${dataProductId}/select?${serializeRdsParameters(parameters)}`);
  }

  /**
   * Run tabulation query.
   * Running tabulations on the specified data product returns
   * aggregate level data about the dimensions and measures specified.
   * A variety of querying techniques can be used to subset, compute, order, filter and format the results.
   *
   * @param catalogId The ID of the catalog that contains the data product.
   * @param dataProductId The ID of the data product to query.
   * @param parameters Optional parameters for an RDS tabulate query
   * @returns Aggregate level data about the dimensions and measures specified.
   * The shape will vary depending on the `format` query paramter.
   */
  static async tabulate<DS extends FormattedDataSet>(
    catalogId: string,
    dataProductId: string,
    parameters?: RdsTabulateParameters
  ): Promise<HttpResponse<DS>> {
    return HttpUtil.get<DS>(`${this.queryUrl}/${catalogId}/${dataProductId}/tabulate?${serializeRdsParameters(parameters)}`);
  }
}
