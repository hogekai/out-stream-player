import { VideoBid } from "@/type";
import { FluidPlayerFactory } from "./FluidPlayerFactory";

export class OutStreamVideoPlayer {
  private target: HTMLDivElement;
  private bid: VideoBid;

  public constructor(
    target: HTMLDivElement,
    bid: VideoBid
  ) {
    this.target = target;
    this.bid = bid;
  }

  public async play() {
    this.renderVideoContainer(this.target, this.bid);
    const video = this.createVideoElement(this.target);
    const fluidPlayerFactory = new FluidPlayerFactory(video,{
      vastUrl: this.bid.vastUrl,
      vastXml: this.bid.vastXml,
    });
    await fluidPlayerFactory.create(this.play.bind(this));
  }

  private createVideoElement(divElement: HTMLDivElement): HTMLVideoElement {
    const video = document.createElement("video");
    divElement.appendChild(video);
    return video;
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
