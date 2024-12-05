import { InlineFrameRender } from "@/core/InlineFrameRender";

describe("Inline frame render", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="target"></div>';
  });

  it("インラインフレームが描画される", () => {
    const sut = new InlineFrameRender();
    const target = document.getElementById("target") as HTMLDivElement;
    const bid = {
      adUnitCode: "ad-unit",
      width: 300,
      height: 250,
      mediaType: "banner" as const,
      ad: `<div>ad</div>`,
      cpm: 100,
    };

    sut.render(target, bid);

    expect(target.innerHTML).toEqual(
      `<iframe name="in_renderer_ads_iframe_ad-unit" title="3rd party ad content" sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation" aria-label="Advertisment" style="border: 0px; margin: 0px; overflow: hidden; width: 300px; height: 250px;"></iframe>`
    );
  });
});
