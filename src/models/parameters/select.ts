import { RdsCommonQueryParameters } from './common-query';

export interface RdsSelectParameters extends RdsCommonQueryParameters {
  /** Limits the number of columns returned. */
  collimit?: number;
  /** Determines which column to start at. */
  coloffset?: number;
  /**
   * Column names, regular expressions, key words,
   * variable groups, or concepts to select.
   * Any of these can be excluded as well by
   * prepending '~' to these syntaxes.
   *
   * @example
   * where=V1=1 AND V2=2
   */
  cols?: string;

  // Explicitly type keys so we can dynamically loop over the properties
  [key: string]: RdsSelectParameters[keyof RdsSelectParameters];
}
