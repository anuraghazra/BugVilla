import styled from 'styled-components';

export const StyledBugCard = styled.div`
  position: relative;

  width: auto;
  height: auto;

  background-color: ${p => p.theme.colors.common.cardBg};
  /* box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05), -1px 0px 1px rgba(0, 0, 0, 0.05),
    1px 0px 1px rgba(0, 0, 0, 0.05), 0px -1px 1px rgba(0, 0, 0, 0.05); */

  border: 1px solid #e7ecfb;
  padding: 25px;
  border-radius: 15px;

  .bug__label-container {
    margin: 10px 0;
  }

  .bug__metainfo {
    display: block;
    margin: 3px 0;
    font-size: 14px;
    color: ${p => p.theme.colors.text.gray};

    a {
      text-decoration: underline;
      font-size: 14px;
      color: ${p => p.theme.colors.text.gray};
    }

    .bug__number {
      font-size: 18px;
    }
  }

  .bug__body--text {
    margin-top: 25px;
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
