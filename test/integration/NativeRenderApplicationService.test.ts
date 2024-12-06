import { NativeRenderApplicationService } from "@/NativeRenderApplicationService";
import { IDomainLogger, IViewableTracker } from "@/type/interface";
import { mock } from "vitest-mock-extended";

describe("Native render application service", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="target"></div>';
  });

  it("広告テンプレートにすべてのアセットが描画された状態でネイティブ広告が描画される", async () => {
    const target = document.getElementById("target") as HTMLDivElement;
    const domainLogger = mock<IDomainLogger>();
    const viewableTracker = mock<IViewableTracker>();
    const sut = new NativeRenderApplicationService(
      domainLogger,
      viewableTracker
    );

    await sut.render(
      target,
      {
        adUnitCode: "11",
        mediaType: "native",
        native: {
          impressionTrackers: [],
          ortb: {
            assets: [
              {
                id: 1,
                title: {
                  text: "title text",
                },
              },
            ],
            link: {
              url: "",
              clicktrackers: [],
              fallback: "",
            },
          },
          adTemplate: "<div>##hb_native_asset_id_1##</div>",
        },
      },
      {}
    );

    expect(target.innerHTML).toBe("<div>title text</div>");
  });

  it("OpenRTBネイティブ入札じゃない場合はログに記録される", async () => {
    const target = document.getElementById("target") as HTMLDivElement;
    const domainLogger = mock<IDomainLogger>();
    const viewableTracker = mock<IViewableTracker>();
    const sut = new NativeRenderApplicationService(
      domainLogger,
      viewableTracker
    );

    await sut.render(
      target,
      {
        adUnitCode: "11",
        mediaType: "native",
        native: {
          impressionTrackers: [],
          adTemplate: "<div>##hb_native_asset_id_1##</div>",
        } as any,
      },
      {}
    );

    expect(domainLogger.unsupportedNativeAsset).toHaveBeenCalledOnce();
  });

  it("広告テンプレートが指定されたいない場合はログに記録される", async () => {
    const target = document.getElementById("target") as HTMLDivElement;
    const domainLogger = mock<IDomainLogger>();
    const viewableTracker = mock<IViewableTracker>();
    const sut = new NativeRenderApplicationService(
      domainLogger,
      viewableTracker
    );

    await sut.render(
      target,
      {
        adUnitCode: "11",
        mediaType: "native",
        native: {
          impressionTrackers: [],
          ortb: {},
        } as any,
      },
      {}
    );

    expect(domainLogger.missingAdTemplate).toHaveBeenCalledOnce();
  });

  it("インプレッションビューアブルイベントが追跡される", async () => {
    const domainLogger = mock<IDomainLogger>();
    const target = document.getElementById("target") as HTMLDivElement;
    const viewableTracker = mock<IViewableTracker>({
      trackViewableMrc50: (_, callback) => {
        callback();
      },
    });
    const sut = new NativeRenderApplicationService(
      domainLogger,
      viewableTracker
    );
    const bid = {
      adUnitCode: "11",
      mediaType: "native" as const,
      native: {
        impressionTrackers: [],
        ortb: {
          assets: [
            {
              id: 1,
              title: {
                text: "title text",
              },
            },
          ],
          link: {
            url: "",
            clicktrackers: [],
            fallback: "",
          },
        },
        adTemplate: "<div>##hb_native_asset_id_1##</div>",
      },
    };
    const impressionViewableMock = vi.fn();

    await sut.render(target, bid, {
      onImpressionViewable: impressionViewableMock,
    });

    expect(impressionViewableMock).toHaveBeenCalledOnce();
  });
});
