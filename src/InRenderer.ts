import "@/style/InRenderer.css";
import './polyfills';
import { OutStreamVideoPlayer } from "@/core/video/OutStreamVideoPlayer";
import { BannerBid, Bid, InRendererOptions, VideoBid } from "@/type";
import { InvalidTargetElementException } from "./exception/InvalidTargetElementException";
import { BannerRenderer } from "./core/banner/BannerRenderer";

export class InRenderer {
  public async render(
    targetId: string,
    bid: Bid,
    options: InRendererOptions = {}
  ) {
    const target = document.getElementById(targetId) as HTMLDivElement;

    if (!target) {
      throw new InvalidTargetElementException();
    }

    target.style.display = "block";

    if (bid.mediaType === "video") {
      await this.renderVideo(target, bid);
    } else if (bid.mediaType === "banner") {
      this.renderBanner(target, bid, options);
    }
  }

  private async renderVideo(target: HTMLDivElement, bid: VideoBid) {
    const outStreamVideoPlayer = new OutStreamVideoPlayer(target, bid);
    await outStreamVideoPlayer.play();
  }

  private renderBanner(
    target: HTMLDivElement,
    bid: BannerBid,
    options: InRendererOptions
  ) {
    const bannerRenderer = new BannerRenderer(target, bid, {
      clickThrough: options.clickThrough,
    });
    bannerRenderer.render();
  }
}
