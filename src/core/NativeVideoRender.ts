import { InvalidNativeVideoContainerException } from "@/exception";
import { Asset, VideoAsset } from "@/type/native";
import { VideoAdRender } from "./VideoAdRender";
import { FluidPlayerFactory } from "./FluidPlayerFactory";

type RenderVideoProps = {
  targetElement: HTMLDivElement;
  playerWidth: number;
  playerHeight: number;
  asset: VideoAsset;
};

export class NativeVideoRender {
  public async render(target: HTMLDivElement, assets: Asset[]) {
    const videoAssetContainers = target.querySelectorAll<HTMLDivElement>(
      ".in-renderer-native-video"
    );

    await Promise.all(
      Array.from(videoAssetContainers).map((videoContainer) => {
        this.validateContainer(videoContainer);

        const assetId = Number(videoContainer.dataset.assetId);
        const playerWidth = Number(videoContainer.dataset.playerWidth);
        const playerHeight = Number(videoContainer.dataset.playerHeight);
        const asset = assets.find((asset) => asset.id === assetId);

        if (asset && "video" in asset) {
          this.renderVideo({
            targetElement: videoContainer,
            playerHeight: playerHeight,
            playerWidth: playerWidth,
            asset: asset,
          });
        }
      })
    );
  }

  private validateContainer(videoAssetContainer: HTMLDivElement) {
    if (
      !videoAssetContainer.dataset.playerWidth ||
      !videoAssetContainer.dataset.playerHeight! ||
      !videoAssetContainer.dataset.assetId
    ) {
      throw new InvalidNativeVideoContainerException();
    }
  }

  private renderVideo({
    targetElement,
    asset,
    playerWidth,
    playerHeight,
  }: RenderVideoProps) {
    const fluidPlayerFactory = new FluidPlayerFactory(targetElement, {
      vastXml: asset.video.vasttag,
    });
    const fluidPlayer = fluidPlayerFactory.create(() =>
      this.renderVideo({ targetElement, asset, playerHeight, playerWidth })
    );

    const videoAdRender = new VideoAdRender();
    videoAdRender.render(
      targetElement,
      {
        vastXml: asset.video.vasttag,
        playerWidth: playerWidth,
        playerHeight: playerHeight,
        mediaType: "video",
      },
      fluidPlayer
    );
  }
}
