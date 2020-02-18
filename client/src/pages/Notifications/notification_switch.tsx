import React from 'react';
import { NavLink } from 'react-router-dom';

const BugLinkTitle: React.FC<{ bugId: string; title: string }> = ({
  bugId,
  title
}) => (
  <NavLink to={`/dashboard/bugs/${bugId}`}>
    #{bugId} <small>({title})</small>
  </NavLink>
);

const Commented: React.FC = ({
  byUser: { username },
  onBug: { bugId, title }
}: any) => {
  return (
    <>
      <NavLink to={`/profiles/${username}`}>@{username}</NavLink>
      <span> commented on </span>
      <BugLinkTitle bugId={bugId} title={title} />
    </>
  );
};

const Referenced: React.FC = ({
  byUser: { username },
  fromBug: { bugId, title },
  references
}: any) => {
  const referenceSlice = references.slice(0, 2);
  const remaining = references.length - referenceSlice.length;

  const refs = referenceSlice.map((ref: any, index: number) => (
    <>
      {references.length === 2 && index > 0 && ' & '}
      <BugLinkTitle bugId={ref.bugId} title={ref.title} key={ref.id} />
    </>
  ));
  return (
    <>
      <span>
        {refs}
        {remaining > 0 && <span> & {remaining} more bugs</span>}
        &nbsp; referenced in &nbsp;
      </span>
      <BugLinkTitle bugId={bugId} title={title} />
      &nbsp;by <NavLink to={`/profiles/${username}`}>@{username}</NavLink>
    </>
  );
};

const NewBug: React.FC = ({
  byUser: { username },
  onBug: { bugId, title }
}: any) => (
  <>
    <NavLink to={`/profiles/${username}`}>@{username}</NavLink>
    <span> created a new bug </span>
    <BugLinkTitle bugId={bugId} title={title} />
  </>
);

const BugStatus: React.FC = ({
  byUser: { username },
  onBug: { bugId, title },
  bug_status
}: any) => (
  <>
    <BugLinkTitle bugId={bugId} title={title} />
    <span> {bug_status} by </span>
    <NavLink to={`/profiles/${username}`}>@{username}</NavLink>
  </>
);

const Mentioned: React.FC = ({
  byUser: { username },
  onBug: { bugId, title },
  mentions
}: any) => {
  return (
    <>
      <NavLink to={`/profiles/${username}`}>@{username} </NavLink>
      <span>
        mentioned
        {mentions.map((username: string, index: number) => {
          return (
            <>
              {mentions.length > 2 && index > mentions.length - 2 && '&'}
              <NavLink to={`/profiles/${username}`}> @{username} </NavLink>
            </>
          );
        })}
      </span>
      <span>
        at <BugLinkTitle bugId={bugId} title={title} />
      </span>
    </>
  );
};

const notification_switch: any = {
  commented: Commented,
  referenced: Referenced,
  new_bug: NewBug,
  bug_status: BugStatus,
  mentioned: Mentioned
};

export default notification_switch;
