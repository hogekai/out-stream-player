import { FluidPlayerFactory } from "./core/FluidPlayerFactory";
import { VideoAdRender } from "./core/VideoAdRender";
import { InvalidBidException } from "./exception";
import { VideoRenderOptions } from "./type";
import { VideoBid } from "./type/bid";
import { IDomainLogger, IViewableTracker } from "./type/interface";

export class VideoRenderApplicationService {
  private domainLogger: IDomainLogger;
  private viewableTracker: IViewableTracker;

  public constructor(
    domainLogger: IDomainLogger,
    viewableTracker: IViewableTracker
  ) {
    this.domainLogger = domainLogger;
    this.viewableTracker = viewableTracker;
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

      const videoAdRender = new VideoAdRender(this.viewableTracker);
      videoAdRender.render(targetElement, bid, {
        play: () => {
          fluidPlayer.setVolume(0);
          fluidPlayer.play();
        },
        pause: () => {
          fluidPlayer.pause();
        }
      });
      this.viewableTracker.trackViewableVideo50(targetElement, () => {
        if (options.onImpressionViewable) {
          options.onImpressionViewable();
        }
      });
    } catch (error) {
      if (error instanceof InvalidBidException) {
        this.domainLogger.invalidBid();
      } else {
        throw error;
      }
    }
  }
}
