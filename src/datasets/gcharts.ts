import { FormattedDataSet } from './formatted';

/** Response type for RDS queries when `format="gcharts"` */
export interface GchartsDataSet extends google.visualization.DataObject, FormattedDataSet {}
