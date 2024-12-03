import "@/style/InRenderer.css";
import './polyfills';
import { InvalidTargetElementException } from "./exception/InvalidTargetElementException";
import { NativeRenderer } from "./core/native/NativeRenderer";
import { NativeBid, Bid } from "./type/bid";
import { InvalidBidException } from "./exception/InvalidBidException";

export class InNativeRenderer {
  public async render(targetId: string, bid: Bid) {
    const target = document.getElementById(targetId) as HTMLDivElement;

    if (!target) {
      throw new InvalidTargetElementException();
    }

    target.style.display = "block";

    if (bid.mediaType === "native") {
      this.renderNative(target, bid);
    } else {
      throw new InvalidBidException();
    }
  }

  private renderNative(target: HTMLDivElement, bid: NativeBid) {
    const nativeRenderer = new NativeRenderer(target, bid);
    nativeRenderer.render();
  }
}
