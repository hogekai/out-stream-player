import { InRendererOptions } from "@/type";
import { InvalidTargetElementException } from "./exception/InvalidTargetElementException";
import { Bid } from "./type/bid";
import { DomainLogger } from "./DomainLogger";
import { Logger } from "./Logger";
import { VideoRenderApplicationService } from "./VideoRenderApplicationService";
import { BannerRenderApplicationService } from "./BannerRenderApplicationService";
import { NativeRenderApplicationService } from "./NativeRenderApplicationService";

export class InRenderer {
  public async render(
    targetId: string,
    bid: Bid,
    options: InRendererOptions = {}
  ) {
    const domainLogger = new DomainLogger(new Logger());

    try {
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
      } else if (bid.mediaType === "banner") {
        const bannerRenderApplicationService =
          new BannerRenderApplicationService(domainLogger);
        bannerRenderApplicationService.render(target, bid, {
          clickThrough: options.clickThrough,
        });
      } else if (bid.mediaType === "native") {
        const nativeRenderApplicationService =
          new NativeRenderApplicationService(domainLogger);
        nativeRenderApplicationService.render(target, bid);
      }
    } catch (error) {
      if (error instanceof InvalidTargetElementException) {
        domainLogger.invalidTargetElement();
      }
    }
  }
}
