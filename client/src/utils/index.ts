export const formatDate = (date: string): string =>
    new Date(date)
        .toDateString()
        .slice(4, 10)
        .toLowerCase();