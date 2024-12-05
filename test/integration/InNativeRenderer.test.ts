import { InvalidTargetElementException } from "@/exception";
import { InRenderer } from "@/InRenderer";
import { NativeRenderApplicationService } from "@/NativeRenderApplicationService";
import { Native } from "@/type/native";

describe("InNativeRenderer", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="target"></div>';
  });

  it("ネイティブ入札でネイティブ広告が描画される", async () => {
    const renderSpy = vi.spyOn(
      NativeRenderApplicationService.prototype,
      "render"
    );
    const sut = new InRenderer();
    const bid = {
      adUnitCode: "ad-unit",
      width: 300,
      height: 250,
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
      cpm: 100,
    };

    await sut.render("target", bid);

    expect(renderSpy).toHaveBeenCalledOnce();
    expect(renderSpy).toHaveBeenCalledWith(
      document.getElementById("target"),
      bid
    );
  });

  it("ターゲット要素が無効な場合は例外が発生する", async () => {
    document.getElementById("target")?.remove();
    const sut = new InRenderer();

    await expect(() => sut.render("target", {} as any)).rejects.toThrow(
      InvalidTargetElementException
    );
  });
});
