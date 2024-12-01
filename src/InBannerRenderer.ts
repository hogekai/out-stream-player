import { InRendererOptions } from "@/type";
import { InvalidTargetElementException } from "./exception/InvalidTargetElementException";
import { BannerRenderer } from "./core/banner/BannerRenderer";
import { BannerBid, Bid } from "./type/bid";
import { InvalidBidException } from "./exception/InvalidBidException";

export class InBannerRenderer {
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

    if (bid.mediaType === "banner") {
      this.renderBanner(target, bid, options);
    } else {
      throw new InvalidBidException();
    }
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
