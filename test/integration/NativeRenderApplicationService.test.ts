import { NativeRenderApplicationService } from "@/NativeRenderApplicationService";
import { IDomainLogger } from "@/type/interface";
import { mock } from "vitest-mock-extended";

describe("Native render application service", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="target"></div>';
  });

  it("広告テンプレートにすべてのアセットが描画された状態でネイティブ広告が描画される", async () => {
    const target = document.getElementById("target") as HTMLDivElement;
    const domainLogger = mock<IDomainLogger>();
    const sut = new NativeRenderApplicationService(domainLogger);

    await sut.render(target, {
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
    });

    expect(target.innerHTML).toBe("<div>title text</div>");
  });

  it("OpenRTBネイティブ入札じゃない場合はログに記録される", async () => {
    const target = document.getElementById("target") as HTMLDivElement;
    const domainLogger = mock<IDomainLogger>();
    const sut = new NativeRenderApplicationService(domainLogger);

    await sut.render(target, {
      adUnitCode: "11",
      mediaType: "native",
      native: {
        impressionTrackers: [],
        adTemplate: "<div>##hb_native_asset_id_1##</div>",
      } as any,
    });

    expect(domainLogger.unsupportedNativeAsset).toHaveBeenCalledOnce();
  });

  it("広告テンプレートが指定されたいない場合はログに記録される", async () => {
    const target = document.getElementById("target") as HTMLDivElement;
    const domainLogger = mock<IDomainLogger>();
    const sut = new NativeRenderApplicationService(domainLogger);

    await sut.render(target, {
      adUnitCode: "11",
      mediaType: "native",
      native: {
        impressionTrackers: [],
        ortb: {},
      } as any,
    });

    expect(domainLogger.missingAdTemplate).toHaveBeenCalledOnce();
  });
});
