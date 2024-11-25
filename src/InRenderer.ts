import { OutStreamVideoPlayer } from "@/core/video/OutStreamVideoPlayer";
import { Bid, VideoBid } from "@/type";
import { InvalidTargetElementException } from "./exception/InvalidTargetElementException";
import '@/style/InRenderer.css';

export class InRenderer {
  public async render(targetId: string, bid: Bid) {
    const target = document.getElementById(targetId) as HTMLDivElement;

    if (!target) {
      throw new InvalidTargetElementException();
    }

    target.style.display = "block";

    if (bid.mediaType === "video") {
      await this.renderVideo(target, bid);
    }
  }

  private async renderVideo(target: HTMLDivElement, bid: VideoBid) {
    this.renderVideoContainer(target, bid);

    const outStreamVideoPlayer = new OutStreamVideoPlayer(target, {
      vastUrl: bid.vastUrl,
      vastXml: bid.vastXml,
    });
    await outStreamVideoPlayer.play();
  }

  private renderVideoContainer(target: HTMLDivElement, bid: VideoBid) {
    const aspectRatio = bid.playerHeight / bid.playerWidth;

    target.style.maxWidth = `${bid.playerWidth}px`;
    target.style.width = "100%";

    const containerWidth = target.offsetWidth;
    const height = containerWidth * aspectRatio;
    target.style.height = height + 'px';
    
    window.addEventListener('resize', () => {
      const newWidth = target.offsetWidth;
      const newHeight = newWidth * aspectRatio;
      target.style.height = newHeight + 'px';
    });
  }
}
