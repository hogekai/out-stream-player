import { IViewableTracker } from "@/type/interface";

export class ViewableTracker implements IViewableTracker {
  private observers: Map<HTMLDivElement, IntersectionObserver> = new Map();

  public trackViewable(
    targetElement: HTMLDivElement,
    callback: () => void
  ): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
          observer.disconnect();
        }
      });
    });

    observer.observe(targetElement);
    this.observers.set(targetElement, observer);
  }

  public trackViewableLost(
    targetElement: HTMLDivElement,
    callback: () => void
  ): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          callback();
          observer.disconnect();
        }
      });
    });

    observer.observe(targetElement);
    this.observers.set(targetElement, observer);
  }

  public trackViewableMrc50(
    targetElement: HTMLDivElement,
    callback: () => void
  ): void {
    const observer = this.createObserver(targetElement, callback, 0.5, 1000);
    observer.observe(targetElement);
    this.observers.set(targetElement, observer);
  }

  public trackViewableMrc100(
    targetElement: HTMLDivElement,
    callback: () => void
  ): void {
    const observer = this.createObserver(targetElement, callback, 1, 1000);
    observer.observe(targetElement);
    this.observers.set(targetElement, observer);
  }

  public trackViewableVideo50(
    targetElement: HTMLDivElement,
    callback: () => void
  ): void {
    const observer = this.createObserver(targetElement, callback, 0.5, 2000);
    observer.observe(targetElement);
    this.observers.set(targetElement, observer);
  }

  public cleanup(targetElement?: HTMLDivElement): void {
    if (targetElement) {
      const observer = this.observers.get(targetElement);
      if (observer) {
        observer.disconnect();
        this.observers.delete(targetElement);
      }
    } else {
      // Disconnect all observers
      this.observers.forEach((observer) => observer.disconnect());
      this.observers.clear();
    }
  }

  private createObserver(
    targetElement: HTMLDivElement,
    callback: () => void,
    threshold: number,
    duration: number
  ): IntersectionObserver {
    let viewTime = 0;
    let startTime: number | null = null;

    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            if (startTime === null) {
              startTime = performance.now();
            }

            viewTime = performance.now() - (startTime || 0);

            if (viewTime >= duration) {
              callback();
              this.observers.get(targetElement)?.disconnect();
              this.observers.delete(targetElement);
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
  }
}
