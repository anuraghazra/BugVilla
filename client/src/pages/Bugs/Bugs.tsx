import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import http from 'utils/httpInstance';
import auth from 'utils/authHelper';
import BugCard from 'components/BugCard/BugCard';

const formatDate = (date: string): string =>
  new Date(date)
    .toDateString()
    .slice(4, 10)
    .toLowerCase();

const BugsWrapper = styled.section`
  margin-top: ${p => p.theme.spacings.top}px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 20px;
  grid-auto-flow: row;
`;

const Bugs: React.FC = () => {
  const history = useHistory<any>();
  const [bugs, setBugs] = useState<any>([]);

  useEffect(() => {
    const getBugs = async () => {
      try {
        let res = await http({
          method: 'GET',
          url: '/api/bugs'
        });
        setBugs(res.data.data);
      } catch (err) {
        auth.logout();
        history.push('/');
      }
    };

    getBugs();
  }, []);

  return (
    <BugsWrapper>
      {bugs &&
        bugs.map((bug: any) => {
          return (
            <BugCard
              key={bug.id}
              title={bug.title}
              number={bug.bugId}
              labels={bug.labels}
              body={bug.body}
              isOpen={bug.isOpen}
              date={formatDate(bug.date_opened)}
              author={bug.author}
            />
          );
        })}
    </BugsWrapper>
  );
};

export default Bugs;
