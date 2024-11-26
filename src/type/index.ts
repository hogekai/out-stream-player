export type OutStreamVideoPlayerOptions = {
  vastUrl?: string;
  vastXml?: string;
};

export type VideoBid = {
  adUnitCode: string;
  vastXml?: string;
  vastUrl?: string;
  width: number;
  height: number;
  playerWidth: number;
  playerHeight: number;
  mediaType: "video";
  cpm: number;
  originalCpm: number;
};

export type BannerBid = {
  adUnitCode: string;
  width: number;
  height: number;
  ad?: string;
  mediaType: "banner";
  cpm: number;
  originalCpm?: number;
};

export type Bid =
  | VideoBid
  | BannerBid
  | {
      width: number;
      height: number;
      mediaType: "native";
      burl?: string;
    };

export type ValidatedBannerBid = {
  adUnitCode: string;
  width: number;
  height: number;
  ad: string;
  mediaType: "banner";
  cpm: number;
  originalCpm?: number;
};

export type BannerRenderOptions = {
  clickThrough?: string;
};

export type InRendererOptions = {
  clickThrough?: string;
};