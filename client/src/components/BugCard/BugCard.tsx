import React from 'react';
import { Link } from 'react-router-dom';

import { Flex, Label, LabelTypes } from '@bug-ui';
import { StyledBugCard, BugCardIcon, StyledMetaInfo } from './BugCard.style';

interface Author {
  name: string;
  username: string;
}

interface BugMetaProps {
  number: number;
  date: string;
  author: Author;
}

interface BugCardProps {
  number: number;
  title: string;
  labels: Array<LabelTypes>;
  body: string;
  isOpen: boolean;
  date: string;
  author: Author;
}

export const BugMetaInfo: React.FC<BugMetaProps> = ({
  number,
  date,
  author
}) => (
  <StyledMetaInfo className="text--light">
    <span className="bug__number">#{number}</span> / on {date} by{' '}
    <Link to={`/profiles/${author.username}`}>{author.name}</Link>
  </StyledMetaInfo>
);

const BugCard: React.FC<BugCardProps> = ({
  number,
  title,
  labels,
  body,
  isOpen,
  date,
  author
}) => {
  return (
    <StyledBugCard>
      <BugCardIcon isOpen={isOpen} />
      <BugMetaInfo number={number} date={date} author={author} />

      <Link to={`/dashboard/bugs/${number}`}>
        <h3 className="bug__title">{title}</h3>
      </Link>

      {labels.length ? (
        <Flex gap="medium" className="mt-large">
          {labels.map((label, index: number) => (
            <Link key={index} to={`/dashboard/bugs/?label=${label}`}>
              <Label type={label}>{label}</Label>
            </Link>
          ))}
        </Flex>
      ) : null}

      <div className="bug__body--text mt-large">{body.slice(0, 150)}</div>
    </StyledBugCard>
  );
};

export default React.memo(BugCard);
