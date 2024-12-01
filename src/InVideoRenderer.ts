import "@/style/InRenderer.css";
import './polyfills';
import { OutStreamVideoPlayer } from "@/core/video/OutStreamVideoPlayer";
import { InRendererOptions} from "@/type";
import { InvalidTargetElementException } from "./exception/InvalidTargetElementException";
import { Bid, VideoBid } from "./type/bid";
import { InvalidBidException } from "./exception/InvalidBidException";

export class InVideoRenderer {
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
    } else {
      throw new InvalidBidException();
    }
  }

  private async renderVideo(target: HTMLDivElement, bid: VideoBid, options: InRendererOptions) {
    const outStreamVideoPlayer = new OutStreamVideoPlayer(target, bid, {
      logo: options.logo
    });
    await outStreamVideoPlayer.play();
  }
}
