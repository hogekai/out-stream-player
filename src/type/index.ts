export type OutStreamVideoPlayerOptions = {
  vastUrl?: string;
  vastXml?: string;
};

export type VideoBid = {
  adUnitCode: string;
  vastXml?: string;
  vastUrl?: string;
  vastImpUrl?: string;
  width: number;
  height: number;
  playerWidth: number;
  playerHeight: number;
  mediaType: "video";
  burl?: string;
};

export type BannerBid = {
  adUnitCode: string;
  width: number;
  height: number;
  ad?: string;
  mediaType: "banner";
  burl?: string;
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
  burl?: string;
};