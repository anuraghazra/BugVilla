import React from 'react';

const MentionPlugin = (source: any) => {
  let match = source.value.match(/@(.*?)\s/gim);
  if (match) {
    const parsed = match.reduce((acc: string, cur: string) => {
      let link = `<a href="/profiles/${cur}">${cur}</a>`;
      return acc.replace(cur, link);
    }, source.value);
    return <span dangerouslySetInnerHTML={{ __html: parsed }}></span>;
  } else {
    return source.value;
  }
};

export default MentionPlugin;
