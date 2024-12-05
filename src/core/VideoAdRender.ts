import '@/style/InRenderer.css';
import { VideoBid } from "@/type/bid";
import { IVideoPlayer } from "@/type/interface";

export class VideoAdRender {
  public render(
    targetElement: HTMLDivElement,
    bid: VideoBid,
    videoPlayer: IVideoPlayer
  ) {
    this.renderContainer(targetElement, bid);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoPlayer.play();
          } else {
            videoPlayer.pause();
          }
        });
      },
      { threshold: 0 }
    );
    observer.observe(targetElement);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        videoPlayer.pause();
      } else {
        videoPlayer.play();
      }
    });
  }

  private renderContainer(targetElement: HTMLDivElement, bid: VideoBid) {
    const aspectRatio = bid.playerHeight / bid.playerWidth;

    targetElement.style.display = "block";
    targetElement.style.maxWidth = `${bid.playerWidth}px`;
    targetElement.style.width = "100%";

    const containerWidth = targetElement.offsetWidth;
    const height = containerWidth * aspectRatio;
    targetElement.style.height = height + "px";

    window.addEventListener("resize", () => {
      const newWidth = targetElement.offsetWidth;
      const newHeight = newWidth * aspectRatio;
      targetElement.style.height = newHeight + "px";
    });
  }
}
