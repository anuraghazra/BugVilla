import React, { useEffect } from 'react';
import styled from 'styled-components';
import Masonry from 'react-masonry-css';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';

import { formatDate } from 'utils';
import Flex from 'components/common/Flex';
import Label from 'components/common/Label';
import Button from 'components/common/Button';
import Loading from 'components/common/Loading';

import DashboardHeader from 'components/DashboardHeader';
import BugCard from 'components/BugCard/BugCard';
import { fetchBugs } from 'store/ducks/bugs';
import { StoreState } from 'store';

const breakpointColumns = {
  default: 3,
  1440: 3,
  1024: 2,
  768: 1
};

const BugsWrapper = styled.section`
  margin-top: 0;
`;

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Bugs: React.FC = () => {
  let query = useQuery();
  const dispatch = useDispatch();
  const bugs = useSelector((state: StoreState) => state.bugs);
  const [isLoading, error] = useSelector((state: StoreState) => [
    state.loading['bugs/FETCH_BUGS'],
    state.error['bugs/FETCH_BUGS']
  ]);

  useEffect(() => {
    dispatch(fetchBugs());
  }, [dispatch]);

  return (
    <BugsWrapper>
      <DashboardHeader>
        <Flex align="center">
          <h1>{query.get('status') ? 'Closed Bugs' : 'Track Bugs'}</h1>
          <Button
            as={NavLink}
            to="/dashboard/new-bug"
            style={{ marginLeft: 20 }}
            icon="plus"
          >
            Add
          </Button>
        </Flex>
        {query.get('label') && (
          <>
            <br />
            <Flex align="center">
              <p>Filter: &nbsp;</p>
              <Label style={{ margin: 0 }} type={query.get('label')}>
                {query.get('label')}
              </Label>
            </Flex>
          </>
        )}
      </DashboardHeader>

      {isLoading && <Loading />}
      {error && <p>Something went wrong while fetching the data</p>}

      <Masonry
        breakpointCols={breakpointColumns}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {bugs &&
          bugs
            .filter((bug: any) => {
              let labelName = query.get('label');
              let status = query.get('status');
              if (!labelName && !status) return true;
              // check for mathcing label or isOpen status
              return bug.labels.includes(labelName) || (status && !bug.isOpen);
            })
            .map((bug: any) => {
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
