import { NativeEventTracker } from "@/core/NativeEventTracker";
import { IViewableTracker } from "@/type/interface";
import { EventTrackingMethod, EventType } from "@/type/native";
import { mock } from "vitest-mock-extended";

describe("Native event tracker", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="target"></div>';
  });

  it("インプレッションでスクリプト追跡される", () => {
    const targetElement = document.getElementById("target") as HTMLDivElement;
    const viewableTracker = mock<IViewableTracker>();
    const sut = new NativeEventTracker(viewableTracker);

    sut.track(targetElement, [
      {
        event: EventType.IMPRESSION,
        method: EventTrackingMethod.JS,
        url: 'https://example.com/url'
      },
    ]);

    expect(targetElement.innerHTML).toBe('<script src="https://example.com/url" async=""></script>');
  });

  it("インプレッションで画像追跡される", () => {
    const targetElement = document.getElementById("target") as HTMLDivElement;
    const viewableTracker = mock<IViewableTracker>();
    const sut = new NativeEventTracker(viewableTracker);

    sut.track(targetElement, [
      {
        event: EventType.IMPRESSION,
        method: EventTrackingMethod.IMG,
        url: 'https://example.com/url'
      },
    ]);

    expect(targetElement.innerHTML).toBe('<img width="1" height="1" src="https://example.com/url" style="display: none;">');
  });

  it("ビューアビリティMRC50がスクリプトで追跡される", () => {
    const targetElement = document.getElementById("target") as HTMLDivElement;
    const viewableTracker = mock<IViewableTracker>({
      trackViewableMrc50: (_, callback) => {
        callback();
      },
    });
    const sut = new NativeEventTracker(viewableTracker);

    sut.track(targetElement, [
      {
        event: EventType.VIEWABLE_MRC50,
        method: EventTrackingMethod.JS,
        url: 'https://example.com/url'
      },
    ]);

    expect(targetElement.innerHTML).toBe('<script src="https://example.com/url" async=""></script>');
  });

  it("ビューアビリティMRC50がスクリプトで追跡される", () => {
    const targetElement = document.getElementById("target") as HTMLDivElement;
    const viewableTracker = mock<IViewableTracker>({
      trackViewableMrc50: (_, callback) => {
        callback();
      },
    });
    const sut = new NativeEventTracker(viewableTracker);

    sut.track(targetElement, [
      {
        event: EventType.VIEWABLE_MRC50,
        method: EventTrackingMethod.IMG,
        url: 'https://example.com/url'
      },
    ]);

    expect(targetElement.innerHTML).toBe('<img width="1" height="1" src="https://example.com/url" style="display: none;">');
  });

  it("ビューアビリティMRC100がスクリプトで追跡される", () => {
    const targetElement = document.getElementById("target") as HTMLDivElement;
    const viewableTracker = mock<IViewableTracker>({
      trackViewableMrc100: (_, callback) => {
        callback();
      },
    });
    const sut = new NativeEventTracker(viewableTracker);

    sut.track(targetElement, [
      {
        event: EventType.VIEWABLE_MRC100,
        method: EventTrackingMethod.JS,
        url: 'https://example.com/url'
      },
    ]);

    expect(targetElement.innerHTML).toBe('<script src="https://example.com/url" async=""></script>');
  });

  it("ビューアビリティMRC100がスクリプトで追跡される", () => {
    const targetElement = document.getElementById("target") as HTMLDivElement;
    const viewableTracker = mock<IViewableTracker>({
      trackViewableVideo50: (_, callback) => {
        callback();
      },
    });
    const sut = new NativeEventTracker(viewableTracker);

    sut.track(targetElement, [
      {
        event: EventType.VIEWABLE_VIDEO50,
        method: EventTrackingMethod.IMG,
        url: 'https://example.com/url'
      },
    ]);

    expect(targetElement.innerHTML).toBe('<img width="1" height="1" src="https://example.com/url" style="display: none;">');
  });

  it("ビューアビリティVideo50がスクリプトで追跡される", () => {
    const targetElement = document.getElementById("target") as HTMLDivElement;
    const viewableTracker = mock<IViewableTracker>({
      trackViewableVideo50: (_, callback) => {
        callback();
      },
    });
    const sut = new NativeEventTracker(viewableTracker);

    sut.track(targetElement, [
      {
        event: EventType.VIEWABLE_VIDEO50,
        method: EventTrackingMethod.IMG,
        url: 'https://example.com/url'
      },
    ]);

    expect(targetElement.innerHTML).toBe('<img width="1" height="1" src="https://example.com/url" style="display: none;">');
  });
});
