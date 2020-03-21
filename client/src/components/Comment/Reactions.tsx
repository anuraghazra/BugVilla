import React from 'react';
import styled from 'styled-components';
import { Flex, Twemoji, Tooltip } from '@bug-ui';

export const ReactionsWrapper = styled(Flex)`
  .reactions {
    padding: 5px 8px;
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

    border: 1px solid ${p => p.theme.colors.offwhite};
    border-left: none;
    &:first-child {
      border-left: 1px solid ${p => p.theme.colors.offwhite};
      border-radius: 5px 0 0 5px;
    }
    &:last-child {
      border-radius: 0 5px 5px 0;
    }
    &:only-child {
      border-radius: 5px;
    }
  }
  .reaction_selected {
    background-color: ${p => p.theme.colors.accent};
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
          <Flex align="center">
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
            className="reactions"
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
          <div className="reactions">{reactionJSX}</div>
        );
      })}
    </ReactionsWrapper>
  );
};

export default React.memo(Reactions);
