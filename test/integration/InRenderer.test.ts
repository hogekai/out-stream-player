import { InRenderer } from "@/InRenderer";

vi.mock("fluid-player");

describe("In renderer", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '<div id="ad"></div>';
  });

  it("Rendering out-stream video advertisements", async () => {
    const div = document.getElementById("ad") as HTMLDivElement;
    Object.defineProperty(div, "offsetWidth", {
      get: vi.fn().mockReturnValue(640),
    });
    const sut = new InRenderer();

    await sut.render("ad", {
      adUnitCode: '11',
      mediaType: "video",
      width: 1000,
      height: 1000,
      playerWidth: 640,
      playerHeight: 480,
      vastUrl: "https://example.com/vasturl",
      cpm: 1,
    });

    expect(div.style.width).toBe("100%");
    expect(div.style.height).toBe("480px");
    expect(div.style.maxWidth).toBe("640px");
    expect(div.style.display).toBe("block");
  });

  it('Rendering banner ads', async () => {
    const div = document.getElementById("ad") as HTMLDivElement;
    Object.defineProperty(div, "offsetWidth", {
      get: vi.fn().mockReturnValue(640),
    });
    const sut = new InRenderer();

    await sut.render("ad", {
      adUnitCode: '11',
      mediaType: "banner",
      width: 300,
      height: 250,
      ad: '<div>ad</div>',
      cpm: 1,
    });

    expect(div.innerHTML).toBe(`<iframe name="in_renderer_ads_iframe_11" title="3rd party ad content" sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation" aria-label="Advertisment" style="border: 0px; margin: 0px; overflow: hidden; width: 300px; height: 250px;"></iframe>`);
  });
});
