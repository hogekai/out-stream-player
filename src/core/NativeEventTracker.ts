import { EventTracker, EventTrackingMethod, EventType } from "@/type/native";
import { ViewableTracker } from "./ViewabilityTracker";
import { IViewableTracker } from "@/type/interface";

export class NativeEventTracker {
    private viewableTracker: IViewableTracker;

    public constructor(viewableTracker: IViewableTracker) {
        this.viewableTracker = viewableTracker;
    }

  public track(targetElement: HTMLDivElement, eventTrackers: EventTracker[]) {
    eventTrackers.forEach((eventTracker) => {
      this.trackEventTracker(targetElement, eventTracker);
    });
  }

  private trackEventTracker(
    targetElement: HTMLDivElement,
    eventTracker: EventTracker
  ) {
    if (eventTracker.url) {
      const url = eventTracker.url;

      if (eventTracker.event === EventType.IMPRESSION) {
        targetElement.appendChild(
          this.generateTrackElement(url, eventTracker.method)
        );
      } else {

        if (eventTracker.event === EventType.VIEWABLE_MRC50) {
          this.viewableTracker.trackViewableMrc50(targetElement, () => {
            targetElement.appendChild(
              this.generateTrackElement(url, eventTracker.method)
            );
            this.viewableTracker.cleanup(targetElement);
          });
        } else if (eventTracker.event === EventType.VIEWABLE_MRC100) {
            this.viewableTracker.trackViewableMrc100(targetElement, () => {
            targetElement.appendChild(
              this.generateTrackElement(url, eventTracker.method)
            );
            this.viewableTracker.cleanup(targetElement);
          });
        } else if (eventTracker.event === EventType.VIEWABLE_VIDEO50) {
            this.viewableTracker.trackViewableVideo50(targetElement, () => {
            targetElement.appendChild(
              this.generateTrackElement(url, eventTracker.method)
            );
            this.viewableTracker.cleanup(targetElement);
          });
        }
      }
    }
  }

  private generateTrackElement(
    url: string,
    method: EventTrackingMethod
  ): HTMLScriptElement | HTMLImageElement {
    if (method === EventTrackingMethod.JS) {
      return this.generateTrackScript(url);
    } else {
      return this.generateTrackImage(url);
    }
  }

  private generateTrackScript(url: string): HTMLScriptElement {
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    return script;
  }

  private generateTrackImage(url: string): HTMLImageElement {
    const image = new Image(1, 1);
    image.src = url;
    image.style.display = "none";
    return image;
  }
}
