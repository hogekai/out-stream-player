import { FluidPlayerFactory } from "./core/FluidPlayerFactory";
import { VideoAdRender } from "./core/VideoAdRender";
import { ViewableTracker } from "./core/ViewabilityTracker";
import { InvalidBidException } from "./exception";
import { VideoRenderOptions } from "./type";
import { VideoBid } from "./type/bid";
import { IDomainLogger } from "./type/interface";

export class VideoRenderApplicationService {
  private domainLogger: IDomainLogger;

  public constructor(domainLogger: IDomainLogger) {
    this.domainLogger = domainLogger;
  }

  public async render(
    targetElement: HTMLDivElement,
    bid: VideoBid,
    options: VideoRenderOptions
  ) {
    try {
      const fluidPlayerFactory = new FluidPlayerFactory(targetElement, {
        vastUrl: bid.vastUrl,
        vastXml: bid.vastXml,
        logo: options.logo,
      });
      const fluidPlayer = await fluidPlayerFactory.create(() =>
        this.render(targetElement, bid, options)
      );

      const videoAdRender = new VideoAdRender(new ViewableTracker());
      videoAdRender.render(targetElement, bid, fluidPlayer);
    } catch (error) {
      if (error instanceof InvalidBidException) {
        this.domainLogger.invalidBid();
      } else {
        throw error;
      }
    }
  }
}
