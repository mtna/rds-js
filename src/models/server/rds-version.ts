export interface RdsVersion {
  /** Version number */
  version: string;
  /** Date the version was released */
  released: string;
  added: string[];
  changed: string[];
  deprecated: string[];
  removed: string[];
  fixed: string[];
  security: string[];
}
