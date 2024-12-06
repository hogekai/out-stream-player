export type Asset =
  | { id: number; img: { url: string; width: string; height: string }, link?: Link }
  | { id: number; data: { value: string }, link?: Link }
  | { id: number; title: { text: string }, link?: Link }
  | VideoAsset;

export type VideoAsset = { id: number; video: { vasttag: string }, link?: Link };

export type Link = {
  clicktrackers: string[];
  fallback: string;
  url: string;
};

export type Native = {
  impressionTrackers: string[];
  ortb: {
    assets: Asset[];
    link: Link;
    privacy?: string;
    eventtrackers?: EventTracker[];
  };
  adTemplate: string;
};

export type EventTracker = {
  event: EventType;
  method: EventTrackingMethod;
  url?: string;
};

export enum EventType {
  IMPRESSION =  1,
  VIEWABLE_MRC50 =  2,
  VIEWABLE_MRC100 = 3,
  VIEWABLE_VIDEO50 = 4,
};

export enum EventTrackingMethod {
  IMG = 1,
  JS = 2,
};