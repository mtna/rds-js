import { Classification, RecordLayout } from '@mtna/pojo-consumer-ui';

export interface DataSetMetadata {
  recordLayout?: RecordLayout;
  classifications?: Classification[];
}
