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
    let timeoutId: number | null = null;
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            if (timeoutId === null) {
              timeoutId = window.setTimeout(() => {
                callback();
                observer.disconnect();
                timeoutId = null;
              }, duration);
            }
          } else {
            if (timeoutId !== null) {
              window.clearTimeout(timeoutId);
              timeoutId = null;
            }
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
