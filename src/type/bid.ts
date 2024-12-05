import { Native } from "./native";

export type Bid = VideoBid | BannerBid | NativeBid;

export type VideoBid = {
  vastXml?: string;
  vastUrl?: string;
  playerWidth: number;
  playerHeight: number;
  mediaType: "video";
};

export type BannerBid = {
  adUnitCode: string;
  width: number;
  height: number;
  ad: string;
  mediaType: "banner";
  cpm: number;
  originalCpm?: number;
};

export type NativeBid = {
  adUnitCode: string;
  native: Native;
  mediaType: "native";
};