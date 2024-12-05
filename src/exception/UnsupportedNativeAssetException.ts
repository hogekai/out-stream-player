export class UnsupportedNativeAssetException extends Error {
  public name: string = "UnsupportedNativeAssetException";
  public message: string = "This native asset is not supported.'";
}
