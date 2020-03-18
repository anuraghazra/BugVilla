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

    &--sticky {
      position: sticky;
      top: ${p => p.theme.spacings.top}px;
    }

    h4 {
      margin: 20px 0;
      margin-bottom: 10px;
      font-size: 17px;
    }

    .label__header {
      position: relative;
      cursor: pointer;

      &:hover {
        color: ${p => p.theme.colors.primary};
      }
    }
  }
`;

export default SingleBugWrapper;
