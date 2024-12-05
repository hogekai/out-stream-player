import { BannerBid } from "@/type/bid";

export class InlineFrameRender {
  public render(
    targetElement: HTMLDivElement,
    bid: BannerBid
  ): HTMLIFrameElement {
    const inlineFrame = this.createInlineFrameElement(bid);
    targetElement.appendChild(inlineFrame);

    return inlineFrame;
  }

  private createInlineFrameElement(bid: BannerBid): HTMLIFrameElement {
    const iframe = document.createElement("iframe");
    iframe.scrolling = "no";
    iframe.frameBorder = "0";
    iframe.marginHeight = "0";
    iframe.marginHeight = "0";
    iframe.name = `in_renderer_ads_iframe_${bid.adUnitCode}`;
    iframe.title = "3rd party ad content";
    iframe.sandbox.add(
      "allow-forms",
      "allow-popups",
      "allow-popups-to-escape-sandbox",
      "allow-same-origin",
      "allow-scripts",
      "allow-top-navigation-by-user-activation"
    );
    iframe.setAttribute("aria-label", "Advertisment");
    iframe.style.setProperty("border", "0");
    iframe.style.setProperty("margin", "0");
    iframe.style.setProperty("overflow", "hidden");
    iframe.style.width = bid.width + "px";
    iframe.style.height = bid.height + "px";

    return iframe;
  }
}
