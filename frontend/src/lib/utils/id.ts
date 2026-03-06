export function isValidId(value?: string): value is string {
  return !!value && /^[1-9]\d*$/.test(value);
}
