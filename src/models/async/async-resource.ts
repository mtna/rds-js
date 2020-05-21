import { ResolutionListener } from './resolution-listener';

/**
 * An asyncronous resource that can be resolved.
 */
export abstract class AsyncResource {
  /** Whether this resource is resolved */
  private resolved = false;
  /** Whether this resource is resolving */
  private resolving = false;
  /** Array of resolution listeners */
  private resolutionListeners: ResolutionListener[] = [];

  /**
   * Create a new AsyncResource
   *
   * @param resolve whether to resolve the resource now, defaults to false
   */
  constructor(resolve: boolean) {
    if (resolve) {
      this.resolve().catch(error => console.error('[@rds/sdk] AsyncResource: failed to resolve', error));
    }
  }

  /** @returns whether this resource is resolved */
  isResolved(): boolean {
    return this.resolved;
  }

  /** @returns whether this resource is resolving */
  isResolving(): boolean {
    return this.resolving;
  }

  /**
   * Register a listener that will emit when this resource has been resolved sucessfully.
   * @param listener the listener for when this resource has been resolved
   */
  registerResolutionListener(listener: ResolutionListener) {
    this.resolutionListeners.push(listener);
  }

  /**
   * Resolve this resource.
   *
   * @returns a promise that completes once the resource is resolved
   */
  abstract async resolve(): Promise<void>;

  /**
   * Setter for `resolved`.
   * @param resolved whether this resource is resolved
   */
  protected setResolved(resolved: boolean) {
    this.resolved = resolved;
    // When the resource is resolved,
    // notify any resolution listeners
    if (this.resolved) {
      while (this.resolutionListeners.length) {
        this.resolutionListeners.pop()?.resolved();
      }
    }
  }

  /**
   * Setter for `resolving`.
   * @param resolving whether the resource is resolving
   */
  protected setResolving(resolving: boolean) {
    this.resolving = resolving;
  }
}
