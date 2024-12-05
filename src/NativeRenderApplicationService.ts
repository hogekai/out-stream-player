import { NativeAssetMacroReplacer } from "./core/NativeAssetMacroReplacer";
import { NativeLinkHandler } from "./core/NativeLinkHandler";
import { NativeSpecialAssetMacroReplacer } from "./core/NativeSpecialAssetMacroReplacer";
import { NativeVideoRender } from "./core/NativeVideoRender";
import {
  InvalidNativeVideoContainerException,
  MissingAdTemplateException,
  UnsupportedNativeAssetException,
} from "./exception";
import { NativeBid } from "./type/bid";
import { IDomainLogger } from "./type/interface";

export class NativeRenderApplicationService {
  private domainLogger: IDomainLogger;

  public constructor(domainLogger: IDomainLogger) {
    this.domainLogger = domainLogger;
  }

  public async render(targetElement: HTMLDivElement, bid: NativeBid) {
    try {
      this.validateBid(bid);

      const adTemplate = bid.native.adTemplate;
      const nativeAssetMacroReplacer = new NativeAssetMacroReplacer();
      let ad = nativeAssetMacroReplacer.replace(
        adTemplate,
        bid.native.ortb.assets
      );

      const nativeSpecialAssetMacroReplacer =
        new NativeSpecialAssetMacroReplacer();
      ad = nativeSpecialAssetMacroReplacer.replace(
        ad,
        bid.native.ortb.link,
        bid.native.ortb.privacy
      );

      targetElement.innerHTML = ad;

      const nativeVideoRender = new NativeVideoRender();
      await nativeVideoRender.render(targetElement, bid.native.ortb.assets);

      const nativeLinkHandler = new NativeLinkHandler();
      nativeLinkHandler.handle(targetElement, bid.native.ortb.link);
    } catch (error) {
      if (error instanceof InvalidNativeVideoContainerException) {
        this.domainLogger.invalidNativeVideoContainer();
      } else if (error instanceof UnsupportedNativeAssetException) {
        this.domainLogger.unsupportedNativeAsset();
      } else if (error instanceof MissingAdTemplateException) {
        this.domainLogger.missingAdTemplate();
      } else {
        throw error;
      }
    }
  }

  private validateBid(bid: NativeBid) {
    if (!bid?.native || !bid.native?.ortb) {
      throw new UnsupportedNativeAssetException();
    }

    if (!bid.native?.adTemplate) {
      throw new MissingAdTemplateException();
    }
  }
}
