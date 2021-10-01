export const currentTimestampInSecond = (): number => Math.floor(Date.now() / 1000);

export const isExpired = (timestamp: number): boolean => timestamp < currentTimestampInSecond();
