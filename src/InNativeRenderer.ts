import { InvalidTargetElementException } from "./exception/InvalidTargetElementException";
import { Bid } from "./type/bid";
import { DomainLogger } from "./DomainLogger";
import { Logger } from "./Logger";
import { NativeRenderApplicationService } from "./NativeRenderApplicationService";
import { InvalidBidException } from "./exception";
import { ViewableTracker } from "./core/ViewableTracker";
import { NativeRenderOptions } from "./type";

export class InNativeRenderer {
  public async render(targetId: string, bid: Bid, options: NativeRenderOptions = {}) {
    const domainLogger = new DomainLogger(new Logger());

    const target = document.getElementById(targetId) as HTMLDivElement;

    if (!target) {
      throw new InvalidTargetElementException();
    }

    const viewableTracker = new ViewableTracker();
    
    if (bid.mediaType === "native") {
      const nativeRenderApplicationService = new NativeRenderApplicationService(
        domainLogger, viewableTracker
      );
      nativeRenderApplicationService.render(target, bid, options);
    } else {
      throw new InvalidBidException("Unsupported formats.");
    }
  }
}
