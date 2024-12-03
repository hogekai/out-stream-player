import "@/style/InRenderer.css";
import "./polyfills";
import { OutStreamVideoPlayer } from "@/core/video/OutStreamVideoPlayer";
import { InRendererOptions } from "@/type";
import { InvalidTargetElementException } from "./exception/InvalidTargetElementException";
import { BannerRenderer } from "./core/banner/BannerRenderer";
import { BannerBid, Bid, NativeBid, VideoBid } from "./type/bid";
import { NativeRenderer } from "./core/native/NativeRenderer";

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
      await this.renderVideo(target, bid, options);
    } else if (bid.mediaType === "banner") {
      this.renderBanner(target, bid, options);
    } else if (bid.mediaType === "native") {
      this.renderNative(target, bid);
    }
  }

  private async renderVideo(
    target: HTMLDivElement,
    bid: VideoBid,
    options: InRendererOptions
  ) {
    const outStreamVideoPlayer = new OutStreamVideoPlayer(target, bid, {
      logo: options.logo,
    });
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

  private renderNative(
    target: HTMLDivElement,
    bid: NativeBid,
  ) {
    const bannerRenderer = new NativeRenderer(target, bid);
    bannerRenderer.render();
  }
}
