import { FormattedDataSet } from './formatted';

/** Response type for RDS queries when `format="amcharts"` */
export interface AmchartsDataSet extends FormattedDataSet {
  dataProvider: any[];
}
