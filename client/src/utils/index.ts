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

export const getBugRefsFromMarkdown = (markdown: string): number[] => {
  const bugRegx: RegExp = /#(\d)/gim;

  let matchedRefs = markdown.match(bugRegx)
    ?.map((ref: string) => +ref.replace('#', ''))
    ?.filter(
      (value: number, index: number, arr: number[]) =>
        arr.indexOf(value) === index
    );
  return matchedRefs || [];
};


// function htmlspecialchars(str) {
// }
// not sure if it's a good idea
export const htmlDecode = (input: string): string => {
  const map: any = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": "\"",
    "&#39;": "'"
  };
  if (typeof input !== 'string') return '';
  return input.replace(/(&amp;|&lt;|&gt;|&quot;|&#39;)/mg, (m) => map[m]);
};