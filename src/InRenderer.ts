import { InRendererOptions } from "@/type";
import { InvalidTargetElementException } from "./exception/InvalidTargetElementException";
import { Bid } from "./type/bid";
import { DomainLogger } from "./DomainLogger";
import { Logger } from "./Logger";
import { VideoRenderApplicationService } from "./VideoRenderApplicationService";
import { BannerRenderApplicationService } from "./BannerRenderApplicationService";
import { NativeRenderApplicationService } from "./NativeRenderApplicationService";
import { ViewableTracker } from "./core/ViewableTracker";

export class InRenderer {
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

    const viewableTracker = new ViewableTracker();

    if (bid.mediaType === "video") {
      const videoRenderApplicationService = new VideoRenderApplicationService(
        domainLogger,
        viewableTracker
      );
      videoRenderApplicationService.render(target, bid, {
        logo: options.logo,
        onImpressionViewable: options.onImpressionViewable,
      });
    } else if (bid.mediaType === "banner") {
      const bannerRenderApplicationService = new BannerRenderApplicationService(
        domainLogger,
        viewableTracker
      );
      bannerRenderApplicationService.render(target, bid, {
        clickThrough: options.clickThrough,
        onImpressionViewable: options.onImpressionViewable,
      });
    } else if (bid.mediaType === "native") {
      const nativeRenderApplicationService = new NativeRenderApplicationService(
        domainLogger,
        viewableTracker
      );
      nativeRenderApplicationService.render(target, bid, {
        onImpressionViewable: options.onImpressionViewable,
      });
    }
  }
}
