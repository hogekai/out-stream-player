import { InvalidBidException } from "@/exception/InvalidBidException";
import { BannerBid, ValidatedBannerBid } from "@/type";
import { isString } from "@/util/validator";

export class BannerRenderer {
  private target: HTMLDivElement;
  private bid: BannerBid;

  public constructor(target: HTMLDivElement, bid: BannerBid) {
    this.target = target;
    this.bid = bid;
  }

  public render() {
    if (!this.validateBid(this.bid)) {
      throw new InvalidBidException();
    } else {
      const iframe = this.renderInlineFrame(this.target, this.bid);
      const iframeDocument = iframe.contentWindow?.document;

      if (iframeDocument) {
        iframeDocument.write(this.bid.ad);
        this.setNormalizeCSS(iframeDocument);

        iframeDocument.close();
      }
    }
  }

  private validateBid(bid: BannerBid): bid is ValidatedBannerBid {
    let valid = true;

    if (!bid.ad || !isString(bid.ad)) {
      valid = true;
    }

    if (!bid.width || !Number.isFinite(bid.width)) {
      valid = false;
    }

    if (!bid.height || !Number.isFinite(bid.height)) {
      valid = false
    }

    if (!bid.adUnitCode || !isString(bid.adUnitCode)) {
        valid = false;
    }

    return valid;
  }

  private renderInlineFrame(
    target: HTMLDivElement,
    bid: BannerBid
  ): HTMLIFrameElement {
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

    target.appendChild(iframe);

    return iframe;
  }

  private setNormalizeCSS(iframeDocument: Document) {
    const normalizeCss = `/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */button,hr,input{overflow:visible}progress,sub,sup{vertical-align:baseline}[type=checkbox],[type=radio],legend{box-sizing:border-box;padding:0}html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}details,main{display:block}h1{font-size:2em;margin:.67em 0}hr{box-sizing:content-box;height:0}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}a{background-color:transparent}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:bolder}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:ButtonText dotted 1px}fieldset{padding:.35em .75em .625em}legend{color:inherit;display:table;max-width:100%;white-space:normal}textarea{overflow:auto}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}[hidden],template{display:none}`;
    const iframeStyle = iframeDocument.createElement("style");
    iframeStyle.appendChild(iframeDocument.createTextNode(normalizeCss));
    iframeDocument.head.appendChild(iframeStyle);
  }
}
