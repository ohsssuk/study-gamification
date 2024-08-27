export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function getRandomNumber(min: number = 0, max: number = 4): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
