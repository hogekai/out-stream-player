export type OutStreamVideoPlayerOptions = {
  vastUrl?: string;
  vastXml?: string;
};

export type VideoBid = {
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

export type Bid =
  | VideoBid
  | {
      width: number;
      height: number;
      mediaType: "banner" | "native";
      burl?: string;
    };
