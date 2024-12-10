import { IDomainLogger, IViewableTracker } from "@/type/interface";
import { VideoRenderApplicationService } from "@/VideoRenderApplicationService";
import fluidPlayer from "fluid-player";
import { mock } from "vitest-mock-extended";

vi.mock("fluid-player");
vi.mock('fetch');
vi.mock('navigator');

describe("Video render application service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '<div id="target"></div>';
  });

  it('VAST XMLとVAST URLを指定するとVAST URLが発火され、でVAST XMlがレンダリング用の素材として使用される', async () => {
    const fluidPlayerMock = vi.mocked(fluidPlayer);
    vi.spyOn(window, 'fetch');
    const beaconMock = vi.spyOn(window.navigator, 'sendBeacon').mockReturnValue(true);
    const domainLogger = mock<IDomainLogger>();
    const viewableTracker = mock<IViewableTracker>();
    const target = document.getElementById("target") as HTMLDivElement;
    const sut = new VideoRenderApplicationService(domainLogger, viewableTracker);
    const bid = {
      mediaType: "video" as const,
      playerWidth: 640,
      playerHeight: 480,
      vastXml: '<VAST></VAST>',
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
              adText: "Learn More",
              roll: "preRoll",
              vastTag: "data:text/xml;charset=utf-8;base64,PFZBU1Q+PC9WQVNUPg==",
            },
          ],
          vastAdvanced: {
            vastVideoEndedCallback: expect.any(Function),
          },
        },
      })
    );
    expect(beaconMock).toHaveBeenCalledOnce();
    expect(beaconMock).toHaveBeenCalledWith('https://example.com/vasturl');
  });

  it('VAST XMLを指定するとVAST XMLがVAST TAGに指定される', async () => {
    const fluidPlayerMock = vi.mocked(fluidPlayer);
    const domainLogger = mock<IDomainLogger>();
    const target = document.getElementById("target") as HTMLDivElement;
    const viewableTracker = mock<IViewableTracker>();
    const sut = new VideoRenderApplicationService(domainLogger, viewableTracker);
    const bid = {
      mediaType: "video" as const,
      playerWidth: 640,
      playerHeight: 480,
      vastXml: '<VAST></VAST>',
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
              adText: "Learn More",
              roll: "preRoll",
              vastTag: "data:text/xml;charset=utf-8;base64,PFZBU1Q+PC9WQVNUPg==",
            },
          ],
          vastAdvanced: {
            vastVideoEndedCallback: expect.any(Function),
          },
        },
      })
    );
  });

  it('VAST URLを指定するとVAST URLのレスポンスがVAST TAGに指定される', async () => {
    const fluidPlayerMock = vi.mocked(fluidPlayer);
    const domainLogger = mock<IDomainLogger>();
    const fetchMock = vi.spyOn(window, 'fetch').mockImplementation(async () => new Response('<VAST></VAST>'));
    const target = document.getElementById("target") as HTMLDivElement;
    const viewableTracker = mock<IViewableTracker>();
    const sut = new VideoRenderApplicationService(domainLogger, viewableTracker);
    const bid = {
      mediaType: "video" as const,
      playerWidth: 640,
      playerHeight: 480,
      vastUrl: 'https://example.com/vastUrl',
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
              adText: "Learn More",
              roll: "preRoll",
              vastTag: "data:text/xml;charset=utf-8;base64,PFZBU1Q+PC9WQVNUPg==",
            },
          ],
          vastAdvanced: {
            vastVideoEndedCallback: expect.any(Function),
          },
        },
      })
    );
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith('https://example.com/vastUrl');
  });

  it("動画広告が描画される", async () => {
    const fluidPlayerInstanceMock = mock<FluidPlayerInstance>();
    vi.spyOn(window, 'fetch');
    const fluidPlayerMock = vi
      .mocked(fluidPlayer)
      .mockImplementation(() => fluidPlayerInstanceMock);
    const domainLogger = mock<IDomainLogger>();
    const target = document.getElementById("target") as HTMLDivElement;
    const viewableTracker = mock<IViewableTracker>();
    const sut = new VideoRenderApplicationService(domainLogger, viewableTracker);
    const bid = {
      mediaType: "video" as const,
      playerWidth: 640,
      playerHeight: 480,
      vastXml: "<VAST></VAST>",
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
              adText: "Learn More",
              roll: "preRoll",
              vastTag: "data:text/xml;charset=utf-8;base64,PFZBU1Q+PC9WQVNUPg==",
            },
          ],
          vastAdvanced: {
            vastVideoEndedCallback: expect.any(Function),
          },
        },
      }
    );
  });

  it('インプレッションビューアブルイベントが追跡される', async () => {
    const domainLogger = mock<IDomainLogger>();
    const target = document.getElementById("target") as HTMLDivElement;
    const viewableTracker = mock<IViewableTracker>({
      trackViewableVideo50: (_, callback) => {
        callback();
      }
    });
    const sut = new VideoRenderApplicationService(domainLogger, viewableTracker);
    const bid = {
      mediaType: "video" as const,
      playerWidth: 640,
      playerHeight: 480,
      vastXml: "<VAST></VAST>",
    };
    const impressionViewableMock = vi.fn();

    await sut.render(target, bid, {
      logo: {
        imageUrl: "https://example.com/logo",
        clickUrl: "https://example.com/clickurl",
      },
      onImpressionViewable: impressionViewableMock
    });

    expect(impressionViewableMock).toHaveBeenCalledOnce();
  });
});
