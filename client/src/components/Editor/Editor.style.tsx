import styled from 'styled-components';

const StyledEditor = styled.div`
  padding: 20px;
  border: 1px solid ${p => p.theme.colors.common.offwhite};
  border-radius: 10px;
  overflow: auto;

  .editor__header {
    margin-bottom: 20px;
  }
  .editor__tabpanel-area {
    border-radius: 5px;
    width: 100%;
    min-height: 300px;
    padding: 20px;
    border: 1px solid ${p => p.theme.colors.common.offwhite};
    color: ${p => p.theme.colors.text.black};
    resize: vertical;

    &::placeholder {
      color: ${p => p.theme.colors.text.gray};
    }
  }

  .react-tabs {
    font-family: ${p => p.theme.font.primary};
    font-size: 14px;
  }
  .react-tabs__tab-list {
    margin: 0;
    margin-left: 15px;
  }

  .react-tabs__tab {
    background-color: ${p => p.theme.colors.common.white};
    border: none;
    border-bottom: 3px solid ${p => p.theme.colors.brand.accent};
  }
  .react-tabs__tab--selected {
    border-bottom: 3px solid ${p => p.theme.colors.brand.primary};
  }

  @media screen and (${p => p.theme.media.tablet}) {
    .react-tabs__tab-list {
      li {
        width: 100px;
        text-align: center;
      }
    }
  }

  .markdown-preview {
    margin-bottom: 10px;
    img {
      width: 50%;
    }

    a {
      position: relative;
      color: ${p => p.theme.colors.brand.primary};

      &:before {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0%;
        height: 2px;
        background-color: ${p => p.theme.colors.brand.primary};
        transition: 0.2s;
      }
      &:hover:before {
        width: 100%;
        transition: 0.2s;
      }
    }
  }
`;

export default StyledEditor;
