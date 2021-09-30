export const currentTimestampInSecond = (): number => Math.floor(Date.now() / 1000);

export const compareTimestamp = (timestamp: number, compareTo: number): number => {
    if (timestamp > compareTo) {
        return 1;
    }
    if (timestamp < compareTo) {
        return -1;
    }
    return 0;
};

export const isExpired = (timestamp: number): boolean => compareTimestamp(timestamp, currentTimestampInSecond()) < 0;
