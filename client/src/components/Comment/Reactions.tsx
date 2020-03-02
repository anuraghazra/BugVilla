import React from 'react';
import Flex from 'components/common/Flex';
import Twemoji from 'components/common/Twemoji';

const Reactions: React.FC<{ reactions: any }> = ({ reactions }) => {
  let reacts: any = {};
  reactions
    // ?.sort((a: any, b: any) => a.emoji.localeCompare(b.emoji))
    ?.forEach(function(obj: any) {
      let key = JSON.stringify(obj.emoji);
      let reactions: any = [obj];

      // fill reactions
      if (reacts[key]?.reactions) {
        reactions = [...reacts[key]?.reactions, obj];
      }
      reacts[key] = {
        count: (reacts[key]?.count || 0) + 1,
        reactions: reactions
      };
    });

  return (
    <Flex align="center" className="comment__reactions">
      {Object.values(reacts)?.map((react: any, index: number) => (
        <Flex key={index} align="center" className="reaction">
          <Twemoji
            className="reaction_emoji"
            emoji={react.reactions[0].emoji}
          />
          <span className="color--gray reaction_count">
            {' '}
            {react.reactions.length}
          </span>
        </Flex>
      ))}
    </Flex>
  );
};

export default Reactions;
