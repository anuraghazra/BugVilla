import styled from 'styled-components';

const VerticalLine = styled.section`
  position: relative;
  :before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 15px;
    width: 0;
    height: 100%;
    border: 1px solid ${p => p.theme.colors.common.offwhite};
    z-index: -1;
  }
`;

export default VerticalLine;