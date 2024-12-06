import { BannerRenderApplicationService } from "@/BannerRenderApplicationService";
import { IDomainLogger, IViewableTracker } from "@/type/interface";
import { mock } from "vitest-mock-extended";

describe("Banner render application service", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="target"></div>';
  });

  it("マクロが置換された状態でバナー広告が描画される", () => {
    const domainLogger = mock<IDomainLogger>();
    const target = document.getElementById("target") as HTMLDivElement;
    const viewableTracker = mock<IViewableTracker>();
    const sut = new BannerRenderApplicationService(
      domainLogger,
      viewableTracker
    );
    const bid = {
      adUnitCode: "ad-unit",
      width: 300,
      height: 250,
      mediaType: "banner" as const,
      ad: "<div>${CLICKTHROUGH}, ${AUCTION_PRICE}</div>",
      cpm: 100,
    };

    sut.render(target, bid, {
      clickThrough: "https://example.com/clickThrough",
    });

    expect(target.innerHTML).toEqual(
      '<iframe name="in_renderer_ads_iframe_ad-unit" title="3rd party ad content" sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation" aria-label="Advertisment" style="border: 0px; margin: 0px; overflow: hidden; width: 300px; height: 250px;"></iframe>'
    );
    const iframe = target.querySelector("iframe");
    expect(iframe?.contentWindow?.document.body.innerHTML).toEqual(
      "<div>https://example.com/clickThrough, 100</div>"
    );
  });

  it("無効なバナー入札が渡されるとログに記録される", () => {
    const domainLogger = mock<IDomainLogger>();
    const target = document.getElementById("target") as HTMLDivElement;
    const viewableTracker = mock<IViewableTracker>();
    const sut = new BannerRenderApplicationService(
      domainLogger,
      viewableTracker
    );
    const bid = {
      adUnitCode: "ad-unit",
      width: 300,
      height: 250,
      mediaType: "banner" as const,
      cpm: 100,
    } as any;

    sut.render(target, bid, {});

    expect(domainLogger.invalidBid).toHaveBeenCalledOnce();
  });

  it("インプレッションビューアブルイベントが追跡される", () => {
    const domainLogger = mock<IDomainLogger>();
    const target = document.getElementById("target") as HTMLDivElement;
    const viewableTracker = mock<IViewableTracker>({
      trackViewableMrc50: (_, callback) => {
        callback();
      },
    });
    const sut = new BannerRenderApplicationService(
      domainLogger,
      viewableTracker
    );
    const bid = {
      adUnitCode: "ad-unit",
      width: 300,
      height: 250,
      mediaType: "banner" as const,
      ad: "<div>ad</div>",
      cpm: 100,
    };
    const impressionViewableMock = vi.fn();

    sut.render(target, bid, {
      onImpressionViewable: impressionViewableMock,
    });

    expect(impressionViewableMock).toHaveBeenCalledOnce();
  });
});
