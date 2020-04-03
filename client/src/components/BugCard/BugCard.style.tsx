import React from 'react';
import styled from 'styled-components';
import { CircleIcon } from '@bug-ui';

export const StyledBugCard = styled.div`
  width: auto;
  position: relative;
  background-color: ${p => p.theme.colors.cardBg};
  border: 1px solid ${p => p.theme.colors.accent};
  border-radius: 10px;
  padding: 25px;
  transition: 0.2s;
  transform: translateY(0);

  &:hover {
    transform: translateY(-2px);
    transition: 0.2s;
  }

  .bug__title {
    font-family: ${p => p.theme.font.primaryMedium};
    line-height: 1.3em;
    margin-bottom: 10px;
    word-break: break-all;

    @media screen and (${p => p.theme.media.tablet}) {
      font-size: 1.4em;
    }
  }

  .bug__body--text {
    font-size: 16px;
    color: ${p => p.theme.colors.gray};
    word-break: break-word;
  }
`;

export const StyledMetaInfo = styled.span`
  display: block;
  margin: 3px 0;
  font-size: 14px;
  color: ${p => p.theme.colors.gray};

  a {
    height: 30px;
    font-size: 14px;
    color: ${p => p.theme.colors.gray};

    &:hover {
      color: ${p => p.theme.colors.black};
    }
  }

  .bug__number {
    font-size: 18px;
  }
`;

const BugCardIconWrapper = styled.div<{ isOpen?: boolean }>`
  position: absolute;
  top: 15px;
  right: 15px;

  display: flex;
  align-items: center;
  justify-content: center;


  /* status hover */
  &:before {
    content: 'status: ${p => (p.isOpen ? 'open' : 'closed')}';
    position: absolute;
    top: 35px;
    left: 50%;
    width: 80px;

    text-align: center;
    font-size: 12px;
    transform: translate(-50%, -50%);
    ${p => p.theme.variants[p.isOpen ? 'success' : 'danger']};
    background: none;

    opacity: 0;
    pointer-events: none;
    transition: 0.2s;
  }

  &:hover:before {
    opacity: 1;
    transition: 0.2s;
  }
`;

export const BugCardIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  return (
    <BugCardIconWrapper isOpen={isOpen}>
      <CircleIcon
        size="25px"
        variant={isOpen ? 'success' : 'danger'}
        icon={isOpen ? 'exclamation' : 'ban'}
      />
    </BugCardIconWrapper>
  );
};
