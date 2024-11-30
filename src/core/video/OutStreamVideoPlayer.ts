import { VideoBid } from "@/type/bid";
import { FluidPlayerFactory } from "./FluidPlayerFactory";
import { OutStreamVideoPlayerOptions } from "@/type";

export class OutStreamVideoPlayer {
  private target: HTMLDivElement;
  private bid: VideoBid;
  private options: OutStreamVideoPlayerOptions;

  public constructor(target: HTMLDivElement, bid: VideoBid, options: OutStreamVideoPlayerOptions) {
    this.target = target;
    this.bid = bid;
    this.options = options;
  }

  public async play() {
    this.renderVideoContainer(this.target, this.bid);
    const video = this.createVideoElement(this.target);
    const fluidPlayerFactory = new FluidPlayerFactory(video, {
      vastUrl: this.bid.vastUrl,
      vastXml: this.bid.vastXml,
      logo: this.options.logo
    });
    const player = await fluidPlayerFactory.create(this.play.bind(this));

    this.attachViewableEvents(player);
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
    target.style.height = height + "px";

    window.addEventListener("resize", () => {
      const newWidth = target.offsetWidth;
      const newHeight = newWidth * aspectRatio;
      target.style.height = newHeight + "px";
    });
  }

  private attachViewableEvents(player: FluidPlayerInstance) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            player.play();
          } else {
            player.pause();
          }
        });
      },
      { threshold: 0 }
    );
    observer.observe(this.target);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        player.pause();
      } else {
        player.play();
      }
    });
  }
}
