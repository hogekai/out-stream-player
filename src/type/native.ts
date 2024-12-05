export type Asset =
  | { id: number; img: { url: string; width: string; height: string } }
  | { id: number; data: { value: string } }
  | { id: number; title: { text: string } }
  | VideoAsset;

export type VideoAsset = { id: number; video: { vasttag: string } };

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
  };
  adTemplate: string;
};
