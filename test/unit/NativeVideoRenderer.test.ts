import { NativeVideoRender } from "@/core/NativeVideoRender";
import { InvalidNativeVideoContainerException } from "@/exception";
import fluidPlayer from "fluid-player";

vi.mock("fluid-player");

describe("Native video renderer", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="target"></div>';
  });

  it("動画アセットが描画される", async () => {
    const fluidPlayerMock = vi.mocked(fluidPlayer);
    const target = document.getElementById("target") as HTMLDivElement;
    target.innerHTML =
      '<div class="in-renderer-native-video" data-asset-id="1" data-player-width="640" data-player-height="480"></div>';
    const sut = new NativeVideoRender();

    await sut.render(target, [
      {
        id: 1,
        video: {
          vasttag: "<VAST></VAST>",
        },
      },
    ]);

    expect(fluidPlayerMock).toHaveBeenCalledOnce();
  });

  it("動画アセットの対象要素にプレイヤーの幅が指定されていない場合は不正が検出される", async () => {
    const target = document.getElementById("target") as HTMLDivElement;
    target.innerHTML =
      '<div class="in-renderer-native-video" data-asset-id="1" data-player-height="480"></div>';
    const sut = new NativeVideoRender();

    await expect(() =>
      sut.render(target, [
        {
          id: 1,
          video: {
            vasttag: "<VAST></VAST>",
          },
        },
      ])
    ).rejects.toThrow(InvalidNativeVideoContainerException);
  });

  it("動画アセットの対象要素にプレイヤーの高さが指定されていない場合は不正が検出される", async () => {
    const target = document.getElementById("target") as HTMLDivElement;
    target.innerHTML =
      '<div class="in-renderer-native-video" data-asset-id="1" data-player-width="640"></div>';
    const sut = new NativeVideoRender();

    await expect(() =>
      sut.render(target, [
        {
          id: 1,
          video: {
            vasttag: "<VAST></VAST>",
          },
        },
      ])
    ).rejects.toThrow(InvalidNativeVideoContainerException);
  });

  it("動画アセットの対象要素にアセットIDが指定されていない場合は不正が検出される", async () => {
    const target = document.getElementById("target") as HTMLDivElement;
    target.innerHTML =
      '<div class="in-renderer-native-video" data-player-width="640"></div>';
    const sut = new NativeVideoRender();

    await expect(() =>
      sut.render(target, [
        {
          id: 1,
          video: {
            vasttag: "<VAST></VAST>",
          },
        },
      ])
    ).rejects.toThrow(InvalidNativeVideoContainerException);
  });
});
