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
    const fluidPlayerFactory = new FluidPlayerFactory(
      this.createVideoElement(this.target),
      this.options
    );
    await fluidPlayerFactory.create();
  }

  private createVideoElement(divElement: HTMLDivElement): HTMLVideoElement {
    const video = document.createElement("video");
    divElement.appendChild(video);
    return video;
  }
}
