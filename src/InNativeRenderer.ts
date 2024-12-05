import { InvalidTargetElementException } from "./exception/InvalidTargetElementException";
import { Bid } from "./type/bid";
import { DomainLogger } from "./DomainLogger";
import { Logger } from "./Logger";
import { NativeRenderApplicationService } from "./NativeRenderApplicationService";
import { InvalidBidException } from "./exception";

export class InNativeRenderer {
  public async render(targetId: string, bid: Bid) {
    const domainLogger = new DomainLogger(new Logger());

    const target = document.getElementById(targetId) as HTMLDivElement;

    if (!target) {
      throw new InvalidTargetElementException();
    }
    if (bid.mediaType === "native") {
      const nativeRenderApplicationService = new NativeRenderApplicationService(
        domainLogger
      );
      nativeRenderApplicationService.render(target, bid);
    } else {
      throw new InvalidBidException("Unsupported formats.");
    }
  }
}
