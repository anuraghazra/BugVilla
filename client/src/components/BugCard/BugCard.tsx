import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Flex from 'components/common/Flex';
import Label from 'components/common/Label';
import { StyledBugCard, BugCardIcon } from './BugCard.style';

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

const BugMetaInfo: React.FC<BugMetaProps> = ({ number, date, author }) => (
  <span className="bug__metainfo text--light">
    <span className="bug__number">#{number}</span> / on {date} by{' '}
    <a href={`/users/${author.username}`}>{author.name}</a>
  </span>
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

      <h3 className="bug__title">{title}</h3>

      {labels.length ? (
        <Flex className="bug__label-container">
          {labels.map((label: any, index: number) => (
            <Label key={index} type={label.name}>
              {label.name}
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
