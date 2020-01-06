import React from 'react';
import styled from 'styled-components';
import Masonry from 'react-masonry-css';
import { NavLink } from 'react-router-dom';

import { formatDate } from 'utils';

import useFetch from 'hooks/useFetch';
import Flex from 'components/common/Flex';
import Button from 'components/common/Button';
import Loading from 'components/common/Loading';
import BugCard from 'components/BugCard/BugCard';
import DashboardHeader from 'components/DashboardHeader';

const breakpointColumns = {
  default: 3,
  1440: 3,
  1024: 2,
  768: 1
};

const BugsWrapper = styled.section`
  margin-top: 0;
`;

const Bugs: React.FC = () => {
  const { data: bugs, isLoading, error } = useFetch('/api/bugs');

  return (
    <BugsWrapper>
      <DashboardHeader>
        <Flex align="center">
          <h1>Track Bugs</h1>
          <Button
            as={NavLink}
            to="/dashboard/new-bug"
            style={{ marginLeft: 20 }}
            icon="plus"
          >
            Add
          </Button>
        </Flex>
      </DashboardHeader>

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
