import styled from 'styled-components';

const SingleBugWrapper = styled.section`
  width: 100%;
  margin-bottom: 40px;
  position: relative;

  display: grid;
  grid-template-columns: 1fr 0.3fr;
  grid-gap: 20px;

  @media screen and (${p => p.theme.media.desktop}) {
    grid-template-columns: 1fr;
  }

  .bug__button {
    float: right;
    margin-bottom: 0;
  }

  .singlebug__aside {
    margin-bottom: ${p => p.theme.spacings.bottom}px;
    
    h4 {
      margin: 20px 0;
      margin-bottom: 10px;
      font-size: 17px;
    }

    .label__header {
      position: relative;
    }
    .label__dropdown {
      position: absolute;
      top: 30px;
      left: 0;
      text-align: center;

      @media screen and (${p => p.theme.media.mobile}) {
        top: 30px;
        left: 0;
      }
    }
  }
`;

export default SingleBugWrapper;
