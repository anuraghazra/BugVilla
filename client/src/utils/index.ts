export const formatDate = (date: string): string =>
  new Date(date)
    .toDateString()
    .slice(4, 10)
    .toLowerCase();

export const getTimeDiff = (dt1: any): string | number => {
  let date1: number = new Date(dt1).getTime();
  let now: number = Date.now();
  let millsec = date1 - now;
  if (date1 < now) {
    millsec = now - date1;
  }
  const days = Math.floor(millsec / 1000 / 60 / (60 * 24));
  const hours = Math.floor(millsec / 1000 / 60 / 60);

  if (hours >= 24) return days + ' days ago';
  return hours + ' hours ago';
}