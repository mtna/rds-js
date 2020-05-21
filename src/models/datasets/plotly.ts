import { FormattedDataSet } from './formatted';

type Datum = string | number | Date | null;
type TypedArray =
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Uint8ClampedArray
  | Float32Array
  | Float64Array;
type PlotType =
  | 'bar'
  | 'box'
  | 'candlestick'
  | 'choropleth'
  | 'contour'
  | 'heatmap'
  | 'histogram'
  | 'indicator'
  | 'mesh3d'
  | 'ohlc'
  | 'parcoords'
  | 'pie'
  | 'pointcloud'
  | 'scatter'
  | 'scatter3d'
  | 'scattergeo'
  | 'scattergl'
  | 'scatterpolar'
  | 'scatterternary'
  | 'sunburst'
  | 'surface'
  | 'treemap'
  | 'waterfall'
  | 'funnel'
  | 'funnelarea';

/**
 * Response type for RDS queries when the format parameter is one of the many `plotly_*`
 * @link <https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/plotly.js/index.d.ts>
 */
export interface PlotlyDataSet extends FormattedDataSet {
  type: PlotType;
  x: Datum[] | Datum[][] | TypedArray;
  y: Datum[] | Datum[][] | TypedArray;
}
