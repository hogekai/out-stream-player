import { HTML5AdRender } from "./core/HTML5AdRender";
import { InlineFrameRender } from "./core/InlineFrameRender";
import { MacroReplacer } from "./core/MacroReplacer";
import { InvalidBidException } from "./exception";
import { BannerRenderOptions } from "./type";
import { BannerBid } from "./type/bid";
import {
  IBannerRenderApplicationService,
  IDomainLogger,
} from "./type/interface";
import { isNumber, isString } from "./util/validator";

export class BannerRenderApplicationService
  implements IBannerRenderApplicationService
{
  private domainLogger: IDomainLogger;

  public constructor(domainLogger: IDomainLogger) {
    this.domainLogger = domainLogger;
  }

  public render(
    targetElement: HTMLDivElement,
    bid: BannerBid,
    options: BannerRenderOptions
  ) {
    try {
      this.validateBid(bid);

      const macroReplacer = new MacroReplacer({
        clickThrough: options.clickThrough,
        cpm: bid.originalCpm || bid.cpm,
      });
      const ad = macroReplacer.replace(bid.ad);

      const inlineFrameRender = new InlineFrameRender();
      const inlineFrame = inlineFrameRender.render(targetElement, bid);

      const html5AdRender = new HTML5AdRender();
      html5AdRender.render(inlineFrame, ad);
    } catch (error) {
      if (error instanceof InvalidBidException) {
        this.domainLogger.invalidBid();
      } else {
        throw error;
      }
    }
  }

  private validateBid(bid: BannerBid) {
    if (!isString(bid.ad) || !isNumber(bid.originalCpm || bid.cpm)) {
      throw new InvalidBidException();
    }
  }
}
