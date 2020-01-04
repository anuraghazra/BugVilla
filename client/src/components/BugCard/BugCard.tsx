import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Flex from 'components/common/Flex';
import Label from 'components/common/Label';
import { StyledBugCard, BugCardIcon } from './BugCard.style';

interface BugCardProps {
  number: number;
  title: string;
  labels: any;
  body: string;
  isOpen: boolean;
  date: string;
  author: { name: string; username: string };
}

const BugCard: React.FC<BugCardProps> = ({
  number,
  title,
  labels,
  body,
  isOpen,
  date,
  author
}) => {
  console.log(labels);
  return (
    <StyledBugCard>
      <BugCardIcon isOpen={isOpen}>
        <FontAwesomeIcon size="xs" icon={isOpen ? 'exclamation' : 'ban'} />
      </BugCardIcon>

      <span className="bug__metainfo">
        <span className="bug__number text--medium">#{number}</span> / on {date}{' '}
        by <a href={`/users/${author.username}`}>{author.name}</a>
      </span>

      <h2>{title}</h2>

      <Flex className="bug__label-container">
        {labels.map((label: any, index: number) => (
          <Label key={index} type={label.name}>
            {label.name}
          </Label>
        ))}
      </Flex>

      <div className="bug__body--text">{body.slice(0, 150)}</div>
    </StyledBugCard>
  );
};

export default BugCard;
