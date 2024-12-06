import { VideoAdRender } from "@/core/VideoAdRender";
import { IVideoPlayer, IViewableTracker } from "@/type/interface";
import { mock } from "vitest-mock-extended";

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
    const viewableTracker = mock<IViewableTracker>();
    const sut = new VideoAdRender(viewableTracker);

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

  it('ビューポートに入ったら動画広告が再生される', async () => {
    const target = document.getElementById("target") as HTMLDivElement;
    Object.defineProperty(target, "offsetWidth", {
      get: vi.fn().mockReturnValue(640),
    });
    const player = mock<IVideoPlayer>();
    const viewableTracker = mock<IViewableTracker>({
      trackViewable: (_, callback) => {
        callback();
      }
    });
    const sut = new VideoAdRender(viewableTracker);

    sut.render(target, {
      mediaType: "video",
      playerWidth: 640,
      playerHeight: 480,
      vastUrl: "https://example.com/vasturl",
    }, player);

    expect(player.play).toHaveBeenCalledOnce();
  });

  it('ビューポートから出たら動画広告が停止される', async () => {
    const target = document.getElementById("target") as HTMLDivElement;
    Object.defineProperty(target, "offsetWidth", {
      get: vi.fn().mockReturnValue(640),
    });
    const player = mock<IVideoPlayer>();
    const viewableTracker = mock<IViewableTracker>({
      trackViewableLost: (_, callback) => {
        callback();
      }
    });
    const sut = new VideoAdRender(viewableTracker);

    sut.render(target, {
      mediaType: "video",
      playerWidth: 640,
      playerHeight: 480,
      vastUrl: "https://example.com/vasturl",
    }, player);

    expect(player.pause).toHaveBeenCalledOnce();
  });
});
