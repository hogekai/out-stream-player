import { Asset, Link } from "@/type/native";

export class NativeLinkHandler {
  public handle(targetElement: HTMLDivElement, link: Link, assets: Asset[]) {
    const linkClass = "pb-click";
    const links = targetElement.querySelectorAll("." + linkClass);

    links.forEach((linkElement) => {
      const assetId = linkElement.getAttribute("hb_native_asset_id");
      const asset = assets.find((asset) => asset.id.toString() === assetId);

      linkElement.addEventListener("click", () => {
        if (asset?.link) {
          this.emitClickTrackers(asset.link);
        } else {
          this.emitClickTrackers(link);
        }
      });
    });
  }

  private emitClickTrackers(link: Link) {
    link.clicktrackers.forEach((clickTracker) => {
      navigator.sendBeacon(clickTracker);
    });
  }
}
