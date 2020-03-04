import React from 'react';
import styled from 'styled-components';
import Flex from 'components/common/Flex';
import Twemoji from 'components/common/Twemoji';

export const ReactionsWrapper = styled(Flex)`
  margin-top: 20px;
  .reaction {
    padding: 5px 8px;
    border: 1px solid ${p => p.theme.colors.common.offwhite};
    border-left: none;
    cursor: pointer;
    z-index: 0;

    &:hover {
      background-color: ${p => p.theme.colors.brand.accent};
    }
    .reaction_emoji {
      font-size: 16px;
    }
    .reaction_count {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .reaction_selected {
    background-color: ${p => p.theme.colors.brand.accent};
  }
  .reaction:first-child {
    border: 1px solid ${p => p.theme.colors.common.offwhite};
    border-radius: 5px 0 0 5px;
  }
  .reaction:last-child {
    border-radius: 0 5px 5px 0;
  }
  .reaction:only-child {
    border-radius: 5px;
  }
`;

export interface ReactionType {
  emoji: string;
  users: string[];
}
const Reactions: React.FC<{ reactions: ReactionType[] }> = ({ reactions }) => {
  
  return (
    <ReactionsWrapper align="center">
      {reactions?.map((react, index: number) => (
        <Flex key={index} align="center" className="reaction">
          <Twemoji className="reaction_emoji" emoji={react.emoji} />
          <span className="color--gray reaction_count">
            {' '}
            {react.users.length}
          </span>
        </Flex>
      ))}
    </ReactionsWrapper>
  );
};

export default Reactions;
