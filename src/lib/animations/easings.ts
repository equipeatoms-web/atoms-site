export const EASE = {
  expoOut: [0.16, 1, 0.3, 1] as [number, number, number, number],
  expoInOut: [0.87, 0, 0.13, 1] as [number, number, number, number],
  sineInOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
  smooth: [0.4, 0, 0.2, 1] as [number, number, number, number],
  spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
} as const;

export const DURATION = {
  fast: 0.3,
  base: 0.6,
  slow: 1.0,
  glacial: 1.6,
} as const;
