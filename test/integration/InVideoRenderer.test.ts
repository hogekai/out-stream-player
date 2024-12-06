import { InvalidBidException, InvalidTargetElementException } from "@/exception";
import { InVideoRenderer } from "@/InVideoRenderer";
import { VideoRenderApplicationService } from "@/VideoRenderApplicationService";

describe("InVideoRenderer", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="target"></div>';
  });

  it("動画入札で動画広告が描画される", async () => {
    const renderSpy = vi.spyOn(
      VideoRenderApplicationService.prototype,
      "render"
    );
    const sut = new InVideoRenderer();
    const bid = {
      adUnitCode: "ad-unit",
      playerWidth: 300,
      playerHeight: 250,
      mediaType: "video" as const,
      vastXml: "",
      cpm: 100,
    };

    await sut.render("target", bid);

    expect(renderSpy).toHaveBeenCalledOnce();
    expect(renderSpy).toHaveBeenCalledWith(
      document.getElementById("target"),
      bid,
      {
        logo: undefined
      }
    );
  });

  it('バナー入札で無効な入札の例外が発生する', async () => {
    const sut = new InVideoRenderer();
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

  it('ネイティブ入札で無効な入札の例外が発生する', async () => {
    const sut = new InVideoRenderer();
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
    

    await expect(() => sut.render("target", bid)).rejects.toThrow(InvalidBidException);
  });

  it("ターゲット要素が無効な場合は例外が発生する", async () => {
    document.getElementById("target")?.remove();
    const sut = new InVideoRenderer();

    await expect(() => sut.render("target", {} as any)).rejects.toThrow(
      InvalidTargetElementException
    );
  });
});
