export class Logger {
  public warn(...warns: string[]) {
    console.warn('[InRenderer.js]', warns);
  }
}
