import { Link } from "@/type/native";

export class NativeSpecialAssetMacroReplacer {
  public replace(target: string, link: Link, privacy?: string): string {
    let result: string = target;
    result = this.replaceLinkMacros(result, link);
    result = this.replacePrivacyMacros(result, privacy);

    return result;
  }

  private replaceLinkMacros(target: string, link: Link): string {
    return target.replace(/##hb_native_linkurl##/g, link.url);
  }

  private replacePrivacyMacros(target: string, privacy?: string): string {
    return target.replace(/##hb_native_privacy##/g, privacy || "");
  }
}
