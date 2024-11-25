import { OutStreamVideoPlayerOptions } from "@/type";
import { FluidPlayerFactory } from "./FluidPlayerFactory";

export class OutStreamVideoPlayer {
  private target: HTMLDivElement;
  private options: OutStreamVideoPlayerOptions;

  public constructor(
    target: HTMLDivElement,
    options: OutStreamVideoPlayerOptions
  ) {
    this.target = target;
    this.options = options;
  }

  public async play() {
    const video = this.createVideoElement(this.target);
    const fluidPlayerFactory = new FluidPlayerFactory(video, this.options);
    await fluidPlayerFactory.create(this.play.bind(this));
  }

  private createVideoElement(divElement: HTMLDivElement): HTMLVideoElement {
    const video = document.createElement("video");
    divElement.appendChild(video);
    return video;
  }
}
