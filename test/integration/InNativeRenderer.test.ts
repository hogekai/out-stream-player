import { InvalidBidException } from "@/exception/InvalidBidException";
import { InvalidTargetElementException } from "@/exception/InvalidTargetElementException";
import { InNativeRenderer } from "@/InNativeRenderer";

vi.mock("fluid-player");

describe("In native renderer", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '<div id="ad"></div>';
  });

  it("Invalid target element causes error", async () => {
    const div = document.getElementById("ad") as HTMLDivElement;
    div.remove();
    const sut = new InNativeRenderer();

    await expect(() =>
      sut.render("ad", {
        adUnitCode: "11",
        mediaType: "native",
        native: {
          impressionTrackers: [],
          ortb: {
            assets: [],
            link: {
              url: "",
              clicktrackers: [],
              fallback: "",
            },
          },
          adTemplate: "",
        },
      })
    ).rejects.toThrow(InvalidTargetElementException);
  });

  it("Rendering native ads", async () => {
    const div = document.getElementById("ad") as HTMLDivElement;
    const sut = new InNativeRenderer();

    await sut.render("ad", {
      adUnitCode: "11",
      mediaType: "native",
      native: {
        impressionTrackers: [],
        ortb: {
          assets: [{
            id: 1,
            title: {
              text: 'title text'
            }
          }],
          link: {
            url: "https://example.com/linkurl",
            clicktrackers: [],
            fallback: "https://example.com/fallback",
          },
        },
        adTemplate: `<div>##hb_native_asset_id_1##</div><a href="##hb_native_linkurl##"></a>`,
      },
    });

    expect(div.innerHTML).toBe(
      `<div>title text</div><a href="https://example.com/linkurl"></a>`
    );
  });

  it("Error with invalid mediaType", async () => {
    const sut = new InNativeRenderer();

    await expect(() =>
      sut.render("ad", {
        mediaType: "video",
        playerWidth: 640,
        playerHeight: 480,
        vastUrl: "<div>ad</div>",
      })
    ).rejects.toThrow(InvalidBidException);
  });
});
