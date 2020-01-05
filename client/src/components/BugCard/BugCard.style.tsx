import styled from 'styled-components';

export const StyledBugCard = styled.div`
  width: auto;
  position: relative;
  background-color: ${p => p.theme.colors.common.cardBg};
  border: 1px solid #e7ecfb;
  border-radius: 10px;
  padding: 25px;

  .bug__title {
    font-family: ${p => p.theme.font.primaryMedium};
    line-height: 1.3em;
    margin-bottom: 10px;

    @media screen and (${p => p.theme.media.tablet}) {
      font-size: 1.4em;
    }
  }

  .bug__label-container {
    margin: 15px 0;
  }

  .bug__metainfo {
    display: block;
    margin: 3px 0;
    font-size: 14px;
    color: ${p => p.theme.colors.text.gray};

    a {
      font-size: 14px;
      color: ${p => p.theme.colors.text.gray};

      &:hover {
        color: ${p => p.theme.colors.text.black};
      }
    }

    .bug__number {
      font-size: 18px;
    }
  }

  .bug__body--text {
    font-size: 16px;
    color: ${p => p.theme.colors.text.gray};
  }
`;

export const BugCardIcon = styled.div<{ isOpen?: boolean }>`
  position: absolute;
  align-items: center;
  justify-content: center;
  display: flex;

  top: 15px;
  right: 15px;

  width: 25px;
  height: 25px;

  border-radius: 100px;

  color: ${p =>
    p.isOpen ? p.theme.colors.common.green : p.theme.colors.common.red};
  background-color: ${p =>
    p.isOpen
      ? p.theme.colors.common.greenlight
      : p.theme.colors.common.redlight};

  /* status hover */
  &:before {
    width: 80px;
    text-align: center;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    left: -20px;
    content: 'status: ${p => (p.isOpen ? 'open' : 'closed')}';

    font-size: 12px;
    top: 35px;
    left: 50%;
    transform: translate(-50%, -50%);

    transition: 0.2s;
  }

  &:hover:before {
    opacity: 1;
    transition: 0.2s;
  }
`;
