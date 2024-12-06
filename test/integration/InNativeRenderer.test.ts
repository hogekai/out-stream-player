import { InvalidBidException, InvalidTargetElementException } from "@/exception";
import { InNativeRenderer } from "@/InNativeRenderer";
import { NativeRenderApplicationService } from "@/NativeRenderApplicationService";

describe("InNativeRenderer", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="target"></div>';
  });

  it("ネイティブ入札でネイティブ広告が描画される", async () => {
    const renderSpy = vi.spyOn(
      NativeRenderApplicationService.prototype,
      "render"
    );
    const sut = new InNativeRenderer();
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
      bid,
      {}
    );
  });

  it('バナー入札で無効な入札の例外が発生する', async () => {
    const sut = new InNativeRenderer();
    const bid = {
      adUnitCode: "ad-unit",
      width: 300,
      height: 250,
      mediaType: "banner" as const,
      ad: "",
      cpm: 100,
    };

    await expect(() => sut.render("target", bid)).rejects.toThrow(InvalidBidException);
  });

  it('動画入札で無効な入札の例外が発生する', async () => {
    const sut = new InNativeRenderer();
    const bid = {
      adUnitCode: "ad-unit",
      playerWidth: 300,
      playerHeight: 250,
      mediaType: "video" as const,
      vastXml: "",
      cpm: 100,
    };

    await expect(() => sut.render("target", bid)).rejects.toThrow(InvalidBidException);
  });

  it("ターゲット要素が無効な場合は例外が発生する", async () => {
    document.getElementById("target")?.remove();
    const sut = new InNativeRenderer();

    await expect(() => sut.render("target", {} as any)).rejects.toThrow(
      InvalidTargetElementException
    );
  });
});
