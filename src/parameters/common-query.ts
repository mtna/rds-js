import { RdsFormatParamter } from './format';

export interface RdsCommonQueryParameters {
  /** Flag specifying whether the total row count should be returned along side the data. */
  count?: boolean;
  /** RDS can return a variety of JSON objects to plug into various java script charting libraries. Defaults to `mtna_simple`. */
  format?: RdsFormatParamter;
  /**
   * When computing a new variable using a function
   * that depends onaggregation the group by parameter
   * can specify which columns to group by.
   *
   * @example
   * groupby=V1,V2
   */
  groupby?: string[];
  /** Flag specifying to inject codes into the returned records. */
  inject?: boolean;
  /** The limit of records to return. */
  limit?: number;
  /** Flag specifying if metadata should be returned along side the data. */
  metadata?: boolean;
  /** The record to start at. */
  offset?: number;
  /**
   * Allows the data to be reordered in ascending or descending order by column.
   *
   * @example
   * orderby=V1 DESC,V2 ASC
   */
  orderby?: string;
  /** The IDs of variables to use as weights in the resulting data. */
  weights?: string[];
  /**
   * The where parameter allows filters to be applied to the data
   * that will be returned. This follows a syntax similar to a
   * SQL where clause.
   *
   * @example
   * where=V1=1 AND V2=2
   */
  where?: string;

  // Explicitly type keys so we can dynamically loop over the properties
  [key: string]: RdsCommonQueryParameters[keyof RdsCommonQueryParameters];
}
