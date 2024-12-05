import { Link } from "@/type/native";

export class NativeLinkHandler {
  public handle(targetElement: HTMLDivElement, link: Link) {
    const linkClass = "in-renderer-native-link";
    const links = targetElement.querySelectorAll("." + linkClass);

    links.forEach((linkElement) => {
      linkElement.addEventListener("click", () => {
        link.clicktrackers.forEach((clickTracker) => {
          navigator.sendBeacon(clickTracker);
        });
      });
    });
  }
}
