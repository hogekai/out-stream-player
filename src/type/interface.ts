import { BannerRenderOptions, VideoRenderOptions } from ".";
import { BannerBid, NativeBid, VideoBid } from "./bid";

export interface IDomainLogger {
  invalidBid(): void;
  unsupportedNativeAsset(): void;
  missingAdTemplate(): void;
  invalidNativeVideoContainer(): void;
  invalidTargetElement(): void;
}

export interface IVideoPlayer {
  play(): void;
  pause(): void;
}

export interface IBannerRenderApplicationService {
  render(
    targetElement: HTMLDivElement,
    bid: BannerBid,
    options: BannerRenderOptions
  ): void;
}

export interface IVideoRenderApplicationService {
  render(
    targetElement: HTMLDivElement,
    bid: VideoBid,
    options: VideoRenderOptions
  ): void;
}

export interface INativeRenderApplicationService {
  render(targetElement: HTMLDivElement, bid: NativeBid): void;
}

export interface IViewableTracker {
  trackViewable(targetElement: HTMLDivElement, callback: () => void): void;
  trackViewableLost(targetElement: HTMLDivElement, callback: () => void): void;
  trackViewableMrc50(targetElement: HTMLDivElement, callback: () => void): void;
  trackViewableMrc100(
    targetElement: HTMLDivElement,
    callback: () => void
  ): void;
  trackViewableVideo50(
    targetElement: HTMLDivElement,
    callback: () => void
  ): void;
}
