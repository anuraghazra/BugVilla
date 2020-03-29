import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StoreState } from 'store';
import { useHistory } from 'react-router-dom';

import { Flex } from '@bug-ui';
import circleShapes from 'assets/svg/circle_shapes.svg';

import HomeWrapper from './Home.style';

interface HomeProps {
  right: React.FC<{}>;
}
const Home: React.FC<HomeProps> = ({ right: Right }) => {
  const history = useHistory();
  const isAuthenticated = useSelector(
    (state: StoreState) => state.auth.isAuthenticated
  );
  useEffect(() => {
    if (isAuthenticated) {
      history.push('/dashboard/bugs');
    }
  }, [isAuthenticated]);

  return (
    <HomeWrapper>
      <img className="home__shape" src={circleShapes} />
      <Flex>
        <div className="home__left">
          <div className="home__text">
            <h1 className="text--light">Track</h1>
            <h1 className="text--light">Manage</h1>
            <h1 className="text--light">& Kill Bugs</h1>
            <h1 className="text--bold">Effectively</h1>
            <span>Universal bug tracker for everyone!</span>
            {/* <IconLink className="color--white" icon="arrow-right" to="/bugs">
              Wanna see the currenty active bugs?
            </IconLink> */}
          </div>
        </div>
        <div className="home__right">
          <Right />
        </div>
      </Flex>
    </HomeWrapper>
  );
};

export default Home;
