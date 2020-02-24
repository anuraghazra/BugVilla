// DO NOT TOUCH
import React from 'react';

// export function insertMentionLinks(markdown: string) {
//   return markdown.replace(
//     /\B(@([a-zA-Z0-9](-?[a-zA-Z0-9_])+))/g,
//     `**[$1](https://github.com/$2)**`
//   );
// }

// const MentionPlugin = (source: any) => {
//   // /\B((@|#)([a-zA-Z0-9](-?[a-zA-Z0-9_])+))/gm
//   // let match = source.value.match(/(@|#)(.*?)(\s|$|\.)/gim);
//   let mentionMatch = source.value.replace(
//     /(?:^|[^a-zA-Z0-9_＠!@#$%&*])(?:(?:@|＠)(?!\/))([a-zA-Z0-9/_.]{1,15})(?:\b(?!@|＠)|$)/gm,
//     '[<a href="/profiles/${mentionMatch[0]}">${mentionMatch[0]}</a>](ok)'
//   );
//   // let referenceMatch = source.value.match(/#\d+(?:\b)/gm);
//   // console.log(referenceMatch);
//   // if (mentionMatch) {
//   //   const parsed = mentionMatch.reduce((acc: string, cur: string) => {
//   //     let link = `<a href="/profiles/${mentionMatch[0]}">${mentionMatch[0]}</a>`;
//   //     return acc.replace(cur, link);
//   //   }, source.value);
//   //   console.log(parsed);
//   //   return <span dangerouslySetInnerHTML={{ __html: parsed }}></span>;
//   // }
//   // if (referenceMatch) {
//   //   const parsed = referenceMatch.reduce((acc: string, cur: string) => {
//   //     let link = `<a href="/dashboard/bugs/${referenceMatch[0]}">${referenceMatch[0]}</a>`;
//   //     return acc.replace(cur, link);
//   //   }, source.value);
//   //   return <span dangerouslySetInnerHTML={{ __html: parsed }}></span>;
//   // }

//   return mentionMatch;
// };

// export default MentionPlugin;
