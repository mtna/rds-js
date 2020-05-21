import { RdsSelectParameters } from '../models/parameters/select';
import { RdsTabulateParameters } from '../models/parameters/tabulate';

/**
 * Serialize a parameter that has an array of values into a url query parameter.
 *
 * @param name parameter name
 * @param values array of parameter values
 * @returns url query parameter
 */
export function _serializeArrayBasedParameter(name: string, values: any[]): string {
  return !name || !values || !values.length ? '' : `${name}=${values.map(value => encodeURIComponent(value)).join(',')}&`;
}

/**
 * Serialize a parameter that has a primative value type into a url query parameter.
 *
 * @param name parameter name
 * @param value paramter value
 * @returns url query parameter
 */
export function _serializeParameter(name: string, value: any): string {
  return !name || value === null || value === undefined ? '' : `${name}=${encodeURIComponent(value)}&`;
}

/**
 * Serialize RDS query parameter to url query parameters
 *
 * @param  parameters parameters to serialize
 * @returns url query parameters
 */
export function serializeRdsParameters(parameters: RdsSelectParameters | RdsTabulateParameters | undefined): string {
  if (!parameters) {
    return '';
  }

  // Build query parameter string
  let queryParams = '';
  for (const prop in parameters as { [index: string]: any }) {
    if (parameters.hasOwnProperty(prop)) {
      const value = parameters[prop];
      if (Array.isArray(value)) {
        queryParams += _serializeArrayBasedParameter(prop, value);
      } else {
        queryParams += _serializeParameter(prop, value);
      }
    }
  }

  // Remove trailing ampersand
  if (queryParams[queryParams.length - 1] === '&') {
    queryParams = queryParams.substr(0, queryParams.length - 1);
  }

  return queryParams;
}
