import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Flex from 'components/common/Flex';
import Label from 'components/common/Label';
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
  labels: any;
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
      <BugCardIcon isOpen={isOpen}>
        <FontAwesomeIcon size="xs" icon={isOpen ? 'exclamation' : 'ban'} />
      </BugCardIcon>
      <BugMetaInfo number={number} date={date} author={author} />

      <Link to={`/dashboard/bugs/${number}`}>
        <h3 className="bug__title">{title}</h3>
      </Link>

      {labels.length ? (
        <Flex className="bug__label-container">
          {labels.map((label: string, index: number) => (
            <Label style={{ marginBottom: 5 }} key={index} type={label}>
              {label}
            </Label>
          ))}
        </Flex>
      ) : null}

      {/* <ReactMarkdown source={body.slice(0, 150)} className="bug__body--text" /> */}
      <div className="bug__body--text">{body.slice(0, 150)}</div>
    </StyledBugCard>
  );
};

export default BugCard;
