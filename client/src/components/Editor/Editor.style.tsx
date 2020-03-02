import styled from 'styled-components';

const StyledEditor = styled.div`
  padding: 20px;
  background-color: ${p => p.theme.colors.common.white};
  border: 1px solid ${p => p.theme.colors.common.offwhite};
  border-radius: 10px;
  overflow: auto;

  .editor__header {
    margin-bottom: 20px;
  }

  .editor__tabpanel {
    width: 100%;
    min-height: 250px;
    border-radius: 5px;
    padding: 20px;
    color: ${p => p.theme.colors.text.black};

    textarea {
      width: 100%;
      height: 100%;
      min-height: 250px;
      padding: 20px;
      border: 1px solid ${p => p.theme.colors.common.offwhite};
      resize: vertical;
      &::placeholder {
        color: ${p => p.theme.colors.text.gray};
      }
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
`;

export const StyledMentionList = styled.div`
  .editor__tabpanel__suggestions {
    transform: translateY(30px);
    border-radius: 5px;
  }

  .editor__tabpanel__suggestions__list {
    width: fit-content;
    padding: 15px;
    background-color: ${p => p.theme.colors.common.white};
    border-radius: 5px;
    border: ${p => p.theme.border};
    overflow: hidden;
  }

  .editor__tabpanel__suggestions__item {
    display: block;
    width: 150px;
    padding: 10px;
    margin: 0;
    cursor: pointer;
    border: 1px solid transparent;
    &:hover {
      color: ${p => p.theme.colors.common.white};
      background-color: ${p => p.theme.colors.brand.primary};
    }
  }
  .editor__tabpanel__suggestions__item__highlight {
    font-family: ${p => p.theme.font.primaryBold};
  }
`;

export default StyledEditor;
