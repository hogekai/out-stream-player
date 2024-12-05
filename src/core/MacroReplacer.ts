type MacroReplacerProps = {
  clickThrough?: string;
  cpm: number;
};

export class MacroReplacer {
  private clickThrough: string;
  private cpm: number;

  public constructor({ clickThrough = "", cpm }: MacroReplacerProps) {
    this.clickThrough = clickThrough;
    this.cpm = cpm;
  }

  public replace(ad: string): string {
    let replacedAd = ad;
    replacedAd = replacedAd.replace(/\${AUCTION_PRICE}/g, this.cpm.toString());
    replacedAd = replacedAd.replace(/\${CLICKTHROUGH}/g, this.clickThrough);

    return replacedAd;
  }
}
