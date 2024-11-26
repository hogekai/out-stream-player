import { BannerRenderer } from "@/core/banner/BannerRenderer";
import { InvalidBidException } from "@/exception/InvalidBidException";

describe("Banner Renderer", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '<div id="ad"></div>';
  });

  it("Invalid bids will not render.", () => {
    const div = document.getElementById("ad") as HTMLDivElement;
    const sut = new BannerRenderer(div, {
      adUnitCode: "ad-unit",
      mediaType: "banner",
      ad: "<div></div>",
    } as any);

    expect(() => sut.render()).toThrow(InvalidBidException);
  });

  it("Banners are rendered from bids.", () => {
    const div = document.getElementById("ad") as HTMLDivElement;
    const sut = new BannerRenderer(div, {
      adUnitCode: "ad-unit",
      width: 100,
      height: 100,
      mediaType: "banner",
      ad: `<div>ad</div>`,
      cpm: 100,
      originalCpm: 1,
    });

    sut.render();

    const iframe = document.querySelector("iframe");
    expect(iframe?.contentDocument?.body.innerHTML).toContain("<div>ad</div>");
  });

  it('By specifying a click-throw, the click-throw URL is embedded in the ad material.', () => {
    const div = document.getElementById("ad") as HTMLDivElement;
    const sut = new BannerRenderer(div, {
      adUnitCode: "ad-unit",
      width: 100,
      height: 100,
      mediaType: "banner",
      ad: "<div>ad ${CLICKTHROUGH}</div>",
      cpm: 100,
      originalCpm: 1,
    }, {
        clickThrough: 'https://example.com/clickThrough'
    });

    sut.render();

    const iframe = document.querySelector("iframe");
    expect(iframe?.contentDocument?.body.innerHTML).toContain("<div>ad https://example.com/clickThrough</div>");
  });
});
