import { InRendererOptions } from "@/type";
import { InvalidTargetElementException } from "./exception/InvalidTargetElementException";
import { Bid } from "./type/bid";
import { DomainLogger } from "./DomainLogger";
import { Logger } from "./Logger";
import { VideoRenderApplicationService } from "./VideoRenderApplicationService";
import { InvalidBidException } from "./exception";

export class InVideoRenderer {
  public async render(
    targetId: string,
    bid: Bid,
    options: InRendererOptions = {}
  ) {
    const domainLogger = new DomainLogger(new Logger());

    const target = document.getElementById(targetId) as HTMLDivElement;

    if (!target) {
      throw new InvalidTargetElementException();
    }

    if (bid.mediaType === "video") {
      const videoRenderApplicationService = new VideoRenderApplicationService(
        domainLogger
      );
      videoRenderApplicationService.render(target, bid, {
        logo: options.logo,
      });
    } else {
      throw new InvalidBidException("Unsupported formats.");
    }
  }
}
