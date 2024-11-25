import { OutStreamVideoPlayer } from "@/core/video/OutStreamVideoPlayer";
import fluidPlayer from "fluid-player";

vi.mock("fluid-player");

describe("OutStream video player", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '<div id="ad"></div>';
  });

  it("Play outstream video ads", async () => {
    const fluidPlayerMock = vi.mocked(fluidPlayer);
    const div = document.getElementById("ad") as HTMLDivElement;
    const sut = new OutStreamVideoPlayer(div, {
      vastUrl: "https://example.com/vasturl",
    });

    await sut.play();

    const videoElement = div.querySelector("video");
    expect(fluidPlayerMock).toHaveBeenCalledWith(videoElement, {
      layoutControls: {
        roundedCorners: 8,
        fillToContainer: true,
        autoPlay: true,
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
      },
      vastOptions: {
        allowVPAID: true,
        showPlayButton: true,
        adList: [
          {
            adClickable: true,
            adText: "Learn More",
            roll: "preRoll",
            vastTag: "https://example.com/vasturl",
            fallbackVastTags: [""],
          },
        ],
        vastAdvanced: {
          vastVideoEndedCallback: expect.any(Function),
        },
      },
    });
  });

  it("If no VAST URL is specified, VAST XML is specified", async () => {
    const fluidPlayerMock = vi.mocked(fluidPlayer);
    const div = document.getElementById("ad") as HTMLDivElement;
    const sut = new OutStreamVideoPlayer(div, {
      vastXml: "<VAST></VAST>",
    });

    await sut.play();

    const videoElement = div.querySelector("video");
    expect(fluidPlayerMock).toHaveBeenCalledWith(
      videoElement,
      expect.objectContaining({
        vastOptions: {
          allowVPAID: true,
          showPlayButton: true,
          adList: [
            {
              adClickable: true,
              adText: "Learn More",
              roll: "preRoll",
              vastTag: "",
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

  it("If both VAST URL and VAST XML are specified, VAST XML is specified as the fallback", async () => {
    const fluidPlayerMock = vi.mocked(fluidPlayer);
    const div = document.getElementById("ad") as HTMLDivElement;
    const sut = new OutStreamVideoPlayer(div, {
      vastUrl: "https://example.com/vasturl",
      vastXml: "<VAST></VAST>",
    });

    await sut.play();

    const videoElement = div.querySelector("video");
    expect(fluidPlayerMock).toHaveBeenCalledWith(
      videoElement,
      expect.objectContaining({
        vastOptions: {
          allowVPAID: true,
          showPlayButton: true,
          adList: [
            {
              adClickable: true,
              adText: "Learn More",
              roll: "preRoll",
              vastTag: "https://example.com/vasturl",
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
});
