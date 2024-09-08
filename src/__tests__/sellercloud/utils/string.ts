type HackContext = {}; // Dummy

export const stringify =
  (context: HackContext) =>
  <T>(value: T) =>
    String(value);

export const numericOnly = (context: HackContext) => (value: string) => +(value.match(/\d+/)?.[0] ?? 0);

export const padStartZeroes =
  (digits: number) =>
  (context: HackContext) =>
  <T>(value: T) =>
    String(value).padStart(digits, '0');
