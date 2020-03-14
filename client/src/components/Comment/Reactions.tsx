import React from 'react';
import styled from 'styled-components';
import { Flex, Twemoji, Tooltip } from '@bug-ui';

export const ReactionsWrapper = styled(Flex)`
  .reaction {
    padding: 5px 8px;
    border: 1px solid ${p => p.theme.colors.offwhite};
    border-left: none;
    cursor: pointer;
    z-index: 0;

    &:hover {
      background-color: ${p => p.theme.colors.accent};
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
    background-color: ${p => p.theme.colors.accent};
  }
  .reaction:first-child {
    border: 1px solid ${p => p.theme.colors.offwhite};
    border-radius: 5px 0 0 5px;
  }
  .reaction:last-child {
    border-radius: 0 5px 5px 0;
  }
  .reaction:only-child {
    border-radius: 5px;
  }
`;

export interface ReactionUser {
  name: string;
  username: string;
  id: string;
}
export interface ReactionType {
  emoji: string;
  users: Array<string & ReactionUser>;
}

interface ReactionsProps {
  reactions: ReactionType[];
}
const Reactions: React.FC<ReactionsProps> = ({ reactions }) => {
  return (
    <ReactionsWrapper align="center">
      {reactions?.map((react, index: number) => {
        let names = react?.users?.map((e: any) => e.username);
        let sliced = names.slice(0, 2);
        let msg = `${sliced.join(' ')} `;
        let remaining = names.length - sliced.length;
        let reactionJSX = (
          <Flex align="center" className="reaction">
            <Twemoji className="reaction_emoji" emoji={react.emoji} />
            <span className="color--gray reaction_count">
              {' '}
              {react.users.length}
            </span>
          </Flex>
        );
        return react.users[0]?.username ? (
          <Tooltip
            key={index}
            content={
              <small className="color--gray">
                {msg} <br /> {remaining > 0 ? `${remaining} others` : ''}{' '}
                reacted with <Twemoji emoji={react.emoji} />
              </small>
            }
          >
            {reactionJSX}
          </Tooltip>
        ) : (
          reactionJSX
        );
      })}
    </ReactionsWrapper>
  );
};

export default React.memo(Reactions);
