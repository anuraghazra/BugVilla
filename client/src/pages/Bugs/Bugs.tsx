import React from 'react';
import styled from 'styled-components';
import Masonry from 'react-masonry-css';

import { formatDate } from 'utils';

import BugCard from 'components/BugCard/BugCard';
import useFetch from 'hooks/useFetch';
import Loading from 'components/common/Loading';

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
  const { data: bugs, isLoading, error } = useFetch('/api/bugs');

  return (
    <BugsWrapper>
      {isLoading && <Loading />}
      {error && <p>Something went wrong while fetching the data</p>}
      <Masonry
        breakpointCols={breakpointColumns}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {bugs &&
          bugs.data.map((bug: any) => {
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
