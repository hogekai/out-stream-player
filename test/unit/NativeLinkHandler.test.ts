import { NativeLinkHandler } from "@/core/NativeLinkHandler";
import { Link } from "@/type/native";

vi.mock("navigator");

describe("Native link handler", () => {
  beforeEach(() => {
    document.body.innerHTML =
      '<div id="target"><div class="pb-click" hb_native_asset_id="1">click</div></div>';
  });

  it("アセットにリンクが含まれている場合はアセットのリンクでクリックを追跡する", () => {
    const target = document.getElementById("target") as HTMLDivElement;
    const beaconMock = vi
      .spyOn(window.navigator, "sendBeacon")
      .mockReturnValue(true);
    const sut = new NativeLinkHandler();
    const link: Link = {
      url: "https://example.com/url",
      clicktrackers: ["https://example.com"],
      fallback: "https://example.com/fallback",
    };
    sut.handle(target, link, [
      {
        id: 1,
        title: {
          text: "value",
        },
        link: {
          url: "https://example.com/title/url",
          clicktrackers: ["https://example.com/title"],
          fallback: "https://example.com/title/fallback",
        },
      },
    ]);

    target.querySelector(".pb-click")?.dispatchEvent(new Event("click"));

    expect(beaconMock).toHaveBeenCalledOnce();
    expect(beaconMock).toHaveBeenCalledWith("https://example.com/title");
  });

  it("アセットにリンクが含まれていない場合はマスターのリンクでクリックを追跡する", () => {
    const target = document.getElementById("target") as HTMLDivElement;
    const beaconMock = vi
      .spyOn(window.navigator, "sendBeacon")
      .mockReturnValue(true);
    const sut = new NativeLinkHandler();
    const link: Link = {
      url: "https://example.com/url",
      clicktrackers: ["https://example.com"],
      fallback: "https://example.com/fallback",
    };
    sut.handle(target, link, []);

    target.querySelector(".pb-click")?.dispatchEvent(new Event("click"));

    expect(beaconMock).toHaveBeenCalledOnce();
    expect(beaconMock).toHaveBeenCalledWith("https://example.com");
  });
});
