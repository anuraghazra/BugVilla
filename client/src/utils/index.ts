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
  const min = Math.floor(millsec / 1000 / 60);
  if (hours >= 24) return days + ' days ago';
  if (hours < 1) return min + ' min ago';
  return hours + ' hours ago';
}

export const getQuantifiersFromMarkdown = (markdown: string, quantifier: string = '#'): string[] => {
  let regex: RegExp = /#(\d+)/gim;

  if (quantifier === '@') {
    regex = /@(.*?)(\s|$|\.)/gim;
  }

  let matched = markdown.match(regex)
    ?.map((ref: string): any => ref.replace(quantifier, '').trim())
    ?.filter(
      (value: number, index: number, arr: number[]) =>
        arr.indexOf(value) === index
    );
  return matched || [];
};

export const htmlDecode = (input: string): string => {
  if (typeof input !== 'string') return '';
  const textarea = document.createElement("textarea");
  textarea.innerHTML = input;
  return textarea.value;
}