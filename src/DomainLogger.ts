import { Logger } from "./Logger";
import { IDomainLogger } from "./type/interface";

export class DomainLogger implements IDomainLogger {
  private logger: Logger;

  public constructor(logger: Logger) {
    this.logger = logger;
  }

  public invalidBid(): void {
    this.logger.warn("Invalid bid.");
  }

  public unsupportedNativeAsset(): void {
    this.logger.warn('This native asset is not supported.');
  }

  public missingAdTemplate(): void {
    this.logger.warn('Ad template is missing.');
  }

  public invalidNativeVideoContainer(): void {
    this.logger.warn('Native video container is invalid.');
  }

  public invalidTargetElement(): void {
    this.logger.warn('Invalid target element.');
  }
}

