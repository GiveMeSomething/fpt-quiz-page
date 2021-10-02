const datetimeOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
} as const;

export const currentTimestampInString = (): string => {
    const now = new Date();
    const datetime = now.toLocaleString(undefined, datetimeOptions);

    return datetime;
};

export const currentTimestampInSecond = (): number => Math.floor(Date.now() / 1000);

export const isExpired = (timestamp: number): boolean => timestamp < currentTimestampInSecond();
