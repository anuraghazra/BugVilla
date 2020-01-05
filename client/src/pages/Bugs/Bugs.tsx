import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Masonry from 'react-masonry-css';
import { useHistory } from 'react-router-dom';

import http from 'utils/httpInstance';
import auth from 'utils/authHelper';
import { formatDate } from 'utils';

import BugCard from 'components/BugCard/BugCard';

const breakpointColumns = {
  default: 3,
  1440: 3,
  1024: 2,
  768: 1
};

const BugsWrapper = styled.section`
  margin-top: ${p => p.theme.spacings.top}px;
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
      <Masonry
        breakpointCols={breakpointColumns}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
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
      </Masonry>
    </BugsWrapper>
  );
};

export default Bugs;
