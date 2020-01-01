import React from 'react';

import Signup from 'components/Signup/Signup';
import Flex from 'components/common/Flex';
import circleShapes from 'assets/svg/circle_shapes.svg';

import HomeWrapper from './Home.style';
import IconLink from 'components/common/IconLink';

const Home: React.FC = () => {
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
            <IconLink
              className="color--white"
              icon="arrow-right"
              to="/bugs"
            >
              Wanna see the currenty active bugs?
            </IconLink>
          </div>
        </div>
        <div className="home__right">
          <Signup />
        </div>
      </Flex>
    </HomeWrapper>
  )
}

export default Home;