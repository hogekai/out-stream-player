import { InvalidBidException } from "@/exception/InvalidBidException";
import { NativeBid } from "@/type/bid";
import { isString } from "@/util/validator";
import { NativeAdHTMLGenerator } from "./NativeAdHTMLGenerator";
import { OutStreamVideoPlayer } from "../video/OutStreamVideoPlayer";
import { Asset, Link } from "@/type/native";

export class NativeRenderer {
  private target: HTMLDivElement;
  private bid: NativeBid;
  private htmlGenerator: NativeAdHTMLGenerator;

  public constructor(target: HTMLDivElement, bid: NativeBid) {
    this.target = target;
    this.bid = bid;
    this.htmlGenerator = new NativeAdHTMLGenerator();
  }

  public async render() {
    if (!this.validateBid(this.bid)) {
      throw new InvalidBidException();
    } else {
      this.target.innerHTML = this.htmlGenerator.generate(this.bid.native);
      await this.renderVideo(this.bid.native.ortb.assets);
      this.attachPrebidClickEvent(this.target, this.bid.native.ortb.link);
    }
  }

  private validateBid(bid: NativeBid): boolean {
    let valid = true;

    if (!bid?.native || !bid.native?.ortb) {
      valid = false;
    }

    if (!bid.native?.adTemplate) {
      valid = false;
    }

    if (!bid.adUnitCode || !isString(bid.adUnitCode)) {
      valid = false;
    }

    return valid;
  }

  private async renderVideo(assets: Asset[]) {
    const videos = document.querySelectorAll<HTMLDivElement>(
      ".in-renderer-native-video"
    );

    await Promise.all(
      Array.from(videos).map((video) => {
        const assetId = Number(video.dataset.assetId);
        const playerWidth = Number(video.dataset.playerWidth);
        const playerHeight = Number(video.dataset.playerHeight);
        const asset = assets.find((asset) => asset.id === assetId);

        if (asset && "video" in asset) {
          const outStreamVideoPlayer = new OutStreamVideoPlayer(
            video,
            {
              vastXml: asset.video.vasttag,
              playerWidth: playerWidth,
              playerHeight: playerHeight,
              mediaType: "video",
            },
            {}
          );

          return outStreamVideoPlayer.play();
        } else {
          throw new InvalidBidException();
        }
      })
    );
  }

  private attachPrebidClickEvent(target: HTMLDivElement, link: Link) {
    target.querySelectorAll('.in-renderer-native-link').forEach(element => {
      element.addEventListener('click', () => {
        link.clicktrackers.forEach(clickTracker => {
          navigator.sendBeacon(clickTracker);
        });
      });
    });
  }
}
