import { RdsCommonQueryParameters } from './common-query';

export interface RdsTabulateParameters extends RdsCommonQueryParameters {
  /**
   * Columns to use as dimensions.
   *
   * @example
   * dims=V[0-9]+,V1a,$keyword
   */
  dims?: string;
  /**
   * Columns to use as measures. Count is used by default.
   *
   * @example
   * measure=avg:AVG(V1)
   */
  measure?: string;

  /** Flag specifying whether subtotals should be returned along side the data. */
  totals?: boolean;

  // Explicitly type keys so we can dynamically loop over the properties
  [key: string]: RdsTabulateParameters[keyof RdsTabulateParameters];
}
