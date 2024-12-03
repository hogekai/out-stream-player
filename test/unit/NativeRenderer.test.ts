import { NativeRenderer } from "@/core/native/NativeRenderer";
import { InvalidBidException } from "@/exception/InvalidBidException";
import fluidPlayer from "fluid-player";

vi.mock("fluid-player");

describe("Native Renderer", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '<div id="ad"></div>';
  });

  it("Invalid bids will not render.", async () => {
    const div = document.getElementById("ad") as HTMLDivElement;
    const sut = new NativeRenderer(div, {
      adUnitCode: "ad-unit",
      mediaType: "native",
      native: {
        impressionTrackers: [],
        ortb: {
          assets: [
            {
              id: 1,
              title: {
                text: "title text",
              },
            },
          ],
          link: {
            url: "https://example.com/linkurl",
            clicktrackers: [],
            fallback: "https://example.com/fallback",
          },
        },
      },
    } as any);

    await expect(() => sut.render()).rejects.toThrow(InvalidBidException);
  });

  it("Natives are rendered from bids.", async () => {
    const div = document.getElementById("ad") as HTMLDivElement;
    const sut = new NativeRenderer(div, {
      adUnitCode: "ad-unit",
      mediaType: "native",
      native: {
        impressionTrackers: [],
        ortb: {
          assets: [
            {
              id: 1,
              title: {
                text: "title text",
              },
            },
            {
              id: 2,
              data: {
                value: "data-value",
              },
            },
          ],
          link: {
            url: "https://example.com/linkurl",
            clicktrackers: [],
            fallback: "https://example.com/fallback",
          },
        },
        adTemplate: `<div>##hb_native_asset_id_1##</div><a href="##hb_native_linkurl##">##hb_native_asset_id_2##</a>`,
      },
    });

    await sut.render();

    expect(div.innerHTML).toContain(
      `<div>title text</div><a href="https://example.com/linkurl">data-value</a>`
    );
  });

  it("Native video render", async () => {
    const fluidPlayerMock = vi.mocked(fluidPlayer);
    const div = document.getElementById("ad") as HTMLDivElement;
    const sut = new NativeRenderer(div, {
      adUnitCode: "ad-unit",
      mediaType: "native",
      native: {
        impressionTrackers: [],
        ortb: {
          assets: [
            {
              id: 1,
              video: {
                vasttag: "<VAST></VAST>",
              },
            },
          ],
          link: {
            url: "https://example.com/linkurl",
            clicktrackers: [],
            fallback: "https://example.com/fallback",
          },
        },
        adTemplate: `<div class="in-renderer-native-video" data-asset-id="1" data-player-width="640" data-player-height="480"></div>`,
      },
    });

    await sut.render();

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
});
