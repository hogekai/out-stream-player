export function isString(value: unknown): boolean {
  return typeof value === "string";
}

export function isNumber(value: unknown): boolean {
  return typeof value === "number";
}

export function isUrl(string: string): boolean {
  const pattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-.\/?%&=]*)?$/;
  return pattern.test(string);
}
