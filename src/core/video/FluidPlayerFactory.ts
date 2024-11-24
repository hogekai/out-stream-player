import { InvalidBidException } from "@/exception/InvalidBidException";
import { fluidPlayer } from "@/lib/fluidPlayer";
import { OutStreamVideoPlayerOptions } from "@/type";
import { isString, isUrl } from "@/util/validator";
import { encode } from "js-base64";

export class FluidPlayerFactory {
  private target: HTMLVideoElement;
  private options: OutStreamVideoPlayerOptions;

  public constructor(
    target: HTMLVideoElement,
    options: OutStreamVideoPlayerOptions
  ) {
    this.target = target;
    this.options = options;
  }

  public async create(): Promise<FluidPlayerInstance> {
    this.validateVastTags(this.options.vastUrl, this.options.vastXml);

    return fluidPlayer(this.target, {
      layoutControls: {
        fillToContainer: true,
        autoPlay: true,
        mute: true,
        doubleclickFullscreen: false,
        keyboardControl: false,
        loop: false,
        allowTheatre: false,
      },
      vastOptions: {
        adList: [
          {
            roll: "preRoll",
            vastTag: this.getVastUrl(this.options.vastUrl),
            fallbackVastTags: [this.getVastDataUrl(this.options.vastXml)],
          },
        ],
      },
    });
  }

  private validateVastTags(vastUrl?: string, vastXml?: string) {
    if (!this.isValidVastUrl(vastUrl) && !this.isValidVastXml(vastXml)) {
      throw new InvalidBidException();
    }
  }

  private getVastUrl(vastUrl?: string): string {
    if (this.isValidVastUrl(vastUrl)) {
      return vastUrl;
    }

    return "";
  }

  private getVastDataUrl(vastXml?: string): string {
    if (this.isValidVastXml(vastXml)) {
      return this.getVastDataUrlFromVastXml(vastXml);
    }

    return "";
  }

  private isValidVastUrl(vastUrl?: string): vastUrl is string {
    return !!(vastUrl && isString(vastUrl) && isUrl(vastUrl));
  }

  private isValidVastXml(vastXml?: string): vastXml is string {
    return !!(vastXml && isString(vastXml) && vastXml.search(/<VAST/gi) !== -1);
  }

  private getVastDataUrlFromVastXml(vastXml: string): string {
    return (
      "data:text/xml;charset=utf-8;base64," +
      encode(vastXml.replace(/\\"/g, '"'))
    );
  }
}
