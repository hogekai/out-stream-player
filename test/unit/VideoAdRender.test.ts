import { VideoAdRender } from "@/core/VideoAdRender";

describe("Video ad render", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="target"></div>';
  });

  it("動画広告コンテナが描画される", async () => {
    const target = document.getElementById("target") as HTMLDivElement;
    Object.defineProperty(target, "offsetWidth", {
      get: vi.fn().mockReturnValue(640),
    });
    const player = {
      play: vi.fn(),
      pause: vi.fn(),
    };
    const sut = new VideoAdRender();

    sut.render(target, {
      mediaType: "video",
      playerWidth: 640,
      playerHeight: 480,
      vastUrl: "https://example.com/vasturl",
    }, player);

    expect(target.style.width).toBe("100%");
    expect(target.style.height).toBe("480px");
    expect(target.style.maxWidth).toBe("640px");
    expect(target.style.display).toBe("block");
  });
});
