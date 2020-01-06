import React, { useEffect } from 'react';

import Flex from 'components/common/Flex';
import circleShapes from 'assets/svg/circle_shapes.svg';

import HomeWrapper from './Home.style';
import IconLink from 'components/common/IconLink';
import history from 'utils/history';
import auth from 'utils/authHelper';

interface Props {
  right: any;
}
const Home: React.FC<Props> = ({ right: Right }) => {
  useEffect(() => {
    if (auth.loggedIn()) {
      history.push('/dashboard/bugs');
    }
  }, []);

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
            <IconLink className="color--white" icon="arrow-right" to="/bugs">
              Wanna see the currenty active bugs?
            </IconLink>
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
