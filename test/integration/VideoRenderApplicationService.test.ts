import { IDomainLogger } from "@/type/interface";
import { VideoRenderApplicationService } from "@/VideoRenderApplicationService";
import fluidPlayer from "fluid-player";
import { mock } from "vitest-mock-extended";

vi.mock("fluid-player");

describe("Video render application service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '<div id="target"></div>';
  });

  it("VAST URLを指定するとFluid PlayerにVAST TAGとして渡される", async () => {
    const fluidPlayerMock = vi.mocked(fluidPlayer);
    const domainLogger = mock<IDomainLogger>();
    const target = document.getElementById("target") as HTMLDivElement;
    const sut = new VideoRenderApplicationService(domainLogger);
    const bid = {
      mediaType: "video" as const,
      playerWidth: 640,
      playerHeight: 480,
      vastUrl: "https://example.com/vasturl",
    };

    await sut.render(target, bid, {});

    expect(fluidPlayerMock).toHaveBeenCalledWith(
      target.querySelector("video"),
      expect.objectContaining({
        vastOptions: {
          allowVPAID: true,
          showPlayButton: true,
          adList: [
            {
              adClickable: true,
              adText: "LearnMore",
              roll: "preRoll",
              vastTag: "https://example.com/vasturl",
              fallbackVastTags: ["data:text/xml;charset=utf-8;base64,"],
            },
          ],
          vastAdvanced: {
            vastVideoEndedCallback: expect.any(Function),
          },
        },
      })
    );
  });

  it("VAST TAGを指定するとFluidPlayerにフォールバックとしてDATA URL化されたVAST TAGが渡される", async () => {
    const fluidPlayerMock = vi.mocked(fluidPlayer);
    const domainLogger = mock<IDomainLogger>();
    const target = document.getElementById("target") as HTMLDivElement;
    const sut = new VideoRenderApplicationService(domainLogger);
    const bid = {
      mediaType: "video" as const,
      playerWidth: 640,
      playerHeight: 480,
      vastXml: "<VAST></VAST>",
    };

    await sut.render(target, bid, {});

    expect(fluidPlayerMock).toHaveBeenCalledWith(
      target.querySelector("video"),
      expect.objectContaining({
        vastOptions: {
          allowVPAID: true,
          showPlayButton: true,
          adList: [
            {
              adClickable: true,
              adText: "LearnMore",
              roll: "preRoll",
              vastTag: "data:text/xml;charset=utf-8;base64,",
              fallbackVastTags: [
                "data:text/xml;charset=utf-8;base64,PFZBU1Q+PC9WQVNUPg==",
              ],
            },
          ],
          vastAdvanced: {
            vastVideoEndedCallback: expect.any(Function),
          },
        },
      })
    );
  });

  it("VAST TAGとVAST URLを指定するとVAST URLを一番に、フォールバックとしてVAST TAGが渡される", async () => {
    const fluidPlayerMock = vi.mocked(fluidPlayer);
    const domainLogger = mock<IDomainLogger>();
    const target = document.getElementById("target") as HTMLDivElement;
    const sut = new VideoRenderApplicationService(domainLogger);
    const bid = {
      mediaType: "video" as const,
      playerWidth: 640,
      playerHeight: 480,
      vastXml: "<VAST></VAST>",
      vastUrl: "https://example.com/vastUrl",
    };

    await sut.render(target, bid, {});

    expect(fluidPlayerMock).toHaveBeenCalledWith(
      target.querySelector("video"),
      expect.objectContaining({
        vastOptions: {
          allowVPAID: true,
          showPlayButton: true,
          adList: [
            {
              adClickable: true,
              adText: "LearnMore",
              roll: "preRoll",
              vastTag: "https://example.com/vastUrl",
              fallbackVastTags: [
                "data:text/xml;charset=utf-8;base64,PFZBU1Q+PC9WQVNUPg==",
              ],
            },
          ],
          vastAdvanced: {
            vastVideoEndedCallback: expect.any(Function),
          },
        },
      })
    );
  });

  it("動画広告が描画される", async () => {
    const fluidPlayerInstanceMock = mock<FluidPlayerInstance>();
    const fluidPlayerMock = vi
      .mocked(fluidPlayer)
      .mockImplementation(() => fluidPlayerInstanceMock);
    const domainLogger = mock<IDomainLogger>();
    const target = document.getElementById("target") as HTMLDivElement;
    const sut = new VideoRenderApplicationService(domainLogger);
    const bid = {
      mediaType: "video" as const,
      playerWidth: 640,
      playerHeight: 480,
      vastXml: "<VAST></VAST>",
      vastUrl: "https://example.com/vastUrl",
    };
    await sut.render(target, bid, {
      logo: {
        imageUrl: "https://example.com/logo",
        clickUrl: "https://example.com/clickurl",
      },
    });

    expect(fluidPlayerMock).toHaveBeenCalledOnce();
    expect(fluidPlayerMock).toHaveBeenCalledWith(
      target.querySelector("video"),
      {
        layoutControls: {
          roundedCorners: 8,
          fillToContainer: true,
          autoPlay: false,
          mute: true,
          doubleclickFullscreen: false,
          keyboardControl: false,
          loop: false,
          allowTheatre: false,
          miniPlayer: {
            enabled: false,
          },
          preload: "auto",
          persistentSettings: {
            volume: false,
            quality: false,
            speed: false,
            theatre: false,
          },
          layout: "in-renderer-js",
          logo: {
            imageUrl: "https://example.com/logo",
            clickUrl: "https://example.com/clickurl",
            position: "bottom left",
          },
        },
        vastOptions: {
          allowVPAID: true,
          showPlayButton: true,
          adList: [
            {
              adClickable: true,
              adText: "LearnMore",
              roll: "preRoll",
              vastTag: "https://example.com/vastUrl",
              fallbackVastTags: [
                "data:text/xml;charset=utf-8;base64,PFZBU1Q+PC9WQVNUPg==",
              ],
            },
          ],
          vastAdvanced: {
            vastVideoEndedCallback: expect.any(Function),
          },
        },
      }
    );
  });

  it("無効なVAST TAGを渡したらログに記録される", async () => {
    vi.mocked(fluidPlayer);
    const domainLogger = mock<IDomainLogger>();
    const target = document.getElementById("target") as HTMLDivElement;
    const sut = new VideoRenderApplicationService(domainLogger);
    const bid = {
      mediaType: "video" as const,
      playerWidth: 640,
      playerHeight: 480,
      vastXml: "<aa>",
    };

    await sut.render(target, bid, {});

    expect(domainLogger.invalidBid).toHaveBeenCalledOnce();
  });

  it("無効なVAST URLを渡したらログに記録される", async () => {
    vi.mocked(fluidPlayer);
    const domainLogger = mock<IDomainLogger>();
    const target = document.getElementById("target") as HTMLDivElement;
    const sut = new VideoRenderApplicationService(domainLogger);
    const bid = {
      mediaType: "video" as const,
      playerWidth: 640,
      playerHeight: 480,
      vastUrl: "aaa",
    };

    await sut.render(target, bid, {});

    expect(domainLogger.invalidBid).toHaveBeenCalledOnce();
  });
});
