import styled from 'styled-components';

export const UserMetaInfo = styled.div`
  width: 500px;
  padding-right: 30px;
  border-right: 2px solid ${p => p.theme.colors.accent};

  textarea {
    resize: none;
  }

  /* because setting display:none will prevent textarea from getting :focus */
  .bio__textarea--show {
    opacity: 1;
  }
  .bio__textarea--hidden {
    opacity: 0;
    width: 0;
    pointer-events: none;
    position: absolute;
  }
  @media screen and (${p => p.theme.media.desktop}) {
    width: 80%;
    padding-right: 0px;
    border-right: none;
    .usermetainfo__avatar {
      align-items: flex-start;
    }
  }
  @media screen and (${p => p.theme.media.tablet}) {
    width: auto;
    text-align: center;
    .usermetainfo__avatar {
      align-items: center;
    }

    textarea {
      width: 100%;
    }
  }
`;
