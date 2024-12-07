import { IViewableTracker } from "@/type/interface";

export class ViewableTracker implements IViewableTracker {
  public trackViewable(
    targetElement: HTMLDivElement,
    callback: () => void
  ): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
        }
      });
    });

    observer.observe(targetElement);
  }

  public trackViewableLost(
    targetElement: HTMLDivElement,
    callback: () => void
  ): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          callback();
        }
      });
    });

    observer.observe(targetElement);
  }

  public trackViewableMrc50(
    targetElement: HTMLDivElement,
    callback: () => void
  ): void {
    const observer = this.createObserver(callback, 0.5, 1000);
    observer.observe(targetElement);
  }

  public trackViewableMrc100(
    targetElement: HTMLDivElement,
    callback: () => void
  ): void {
    const observer = this.createObserver(callback, 1, 1000);
    observer.observe(targetElement);
  }

  public trackViewableVideo50(
    targetElement: HTMLDivElement,
    callback: () => void
  ): void {
    const observer = this.createObserver(callback, 0.5, 2000);
    observer.observe(targetElement);
  }

  private createObserver(
    callback: () => void,
    threshold: number,
    duration: number
  ): IntersectionObserver {
    let viewTime = 0;
    let startTime: number | null = null;

    const observer =  new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            if (startTime === null) {
              startTime = performance.now();
            }

            viewTime = performance.now() - (startTime || 0);

            if (viewTime >= duration) {
              callback();
              observer.disconnect();
            }
          } else {
            startTime = null;
            viewTime = 0;
          }
        });
      },
      {
        threshold: threshold,
        root: null,
      }
    );

    return observer;
  }
}
