export const formatDate = (date: string): string =>
  new Date(date)
    .toDateString()
    .slice(4, 10)
    .toLowerCase();

// https://github.com/withspectrum/spectrum/blob/alpha/admin/src/helpers/utils.js
export const timeAgo = (time: any): string | number => {
  const MS_PER_SECOND = 1000;
  const MS_PER_MINUTE = 60 * 1000;
  const MS_PER_HOUR = MS_PER_MINUTE * 60;
  const MS_PER_DAY = MS_PER_HOUR * 24;
  const MS_PER_YEAR = MS_PER_DAY * 365;

  let current: any = new Date();
  let previous: any = new Date(time);
  let elapsed = current - previous

  if (elapsed < MS_PER_MINUTE) {
    return Math.round(elapsed / MS_PER_SECOND) + 's ago';
  } else if (elapsed < MS_PER_HOUR) {
    return Math.round(elapsed / MS_PER_MINUTE) + 'm ago';
  } else if (elapsed < MS_PER_DAY) {
    return Math.round(elapsed / MS_PER_HOUR) + 'h ago';
  } else if (elapsed < MS_PER_YEAR) {
    return Math.round(elapsed / MS_PER_DAY) + 'd ago';
  } else {
    return Math.round(elapsed / MS_PER_YEAR) + 'y ago';
  }
}

// @deprecated
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


/**
 * @description Returns array of [@mentions] & [#references] from markdown
 */
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

/**
 * @description safe decode entities
 */
export const htmlDecode = (input: string): string => {
  if (typeof input !== 'string') return '';
  const textarea = document.createElement("textarea");
  textarea.innerHTML = input;
  return textarea.value;
}