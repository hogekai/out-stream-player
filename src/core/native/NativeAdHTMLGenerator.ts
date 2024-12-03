import { Asset, Link, Native } from "@/type/native";

const ASSET_VALUE_PROPERTY_NAME = {
  title: "text",
  data: "value",
  img: "url",
  video: "vasttag",
};

export class NativeAdHTMLGenerator {
  public generate(native: Native): string {
    const { adTemplate, ortb } = native;
    const assets = ortb.assets;
    const link = ortb.link;
    const privacy = ortb.privacy;

    let result = adTemplate;

    result = this.replaceLinkMacros(result, link);
    result = this.replacePrivacyMacros(result, privacy);

    result = this.replaceAssetsMacro(result, assets);

    return result;
  }

  private replaceLinkMacros(target: string, link: Link): string {
    return target.replace(/##hb_native_linkurl##/g, link.url);
  }

  private replacePrivacyMacros(target: string, privacy?: string): string {
    return target.replace(/##hb_native_privacy##/g, privacy || "");
  }

  private replaceAssetsMacro(target: string, assets: Asset[]): string {
    let replacedTarget = target;

    assets.forEach((asset) => {
      replacedTarget = this.replaceAssetMacros(replacedTarget, asset);
    });

    return replacedTarget;
  }

  private replaceAssetMacros(target: string, asset: Asset): string {
    const assetRegex = new RegExp(`##hb_native_asset_id_${asset.id}##`, "g");
    let replacedTarget = target;

    const type = Object.keys(ASSET_VALUE_PROPERTY_NAME).find(
      (type) => asset[type as keyof Asset]
    ) as keyof typeof ASSET_VALUE_PROPERTY_NAME | undefined;

    if (type) {
      const propertyName = ASSET_VALUE_PROPERTY_NAME[type];
      if ("video" in asset) {
        replacedTarget = replacedTarget.replace(
          assetRegex,
          encodeURIComponent(asset.video.vasttag)
        );
      } else {
        replacedTarget = replacedTarget.replace(
          assetRegex,
          (asset as any)[type][propertyName]
        );
      }
    }

    return replacedTarget;
  }
}
