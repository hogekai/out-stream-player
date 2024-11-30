type LogoOption = {
  imageUrl?: string;
  clickUrl?: string;
};

export type OutStreamVideoPlayerOptions = {
  logo?: LogoOption;
};

export type FluidPlayerFactoryOptions = {
  vastUrl?: string;
  vastXml?: string;
  logo?: LogoOption;
};

export type BannerRenderOptions = {
  clickThrough?: string;
};

export type InRendererOptions = {
  clickThrough?: string;
  logo?: LogoOption;
};
