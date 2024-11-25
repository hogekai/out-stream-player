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
    });

    expect(div.style.width).toBe("100%");
    expect(div.style.height).toBe("480px");
    expect(div.style.maxWidth).toBe("640px");
    expect(div.style.display).toBe("block");
  });
});
