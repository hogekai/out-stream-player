import { InvalidTargetElementException } from "@/exception";
import { InRenderer } from "@/InRenderer";
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
    const sut = new InRenderer();
    const bid = {
      adUnitCode: "ad-unit",
      playerWidth: 300,
      playerHeight: 250,
      mediaType: "video" as const,
      vastXml: "<VAST></VAST>",
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

  it("ターゲット要素が無効な場合は例外が発生する", async () => {
    document.getElementById("target")?.remove();
    const sut = new InRenderer();

    await expect(() => sut.render("target", {} as any)).rejects.toThrow(
      InvalidTargetElementException
    );
  });
});
