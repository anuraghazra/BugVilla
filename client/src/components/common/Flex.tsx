import styled from 'styled-components/macro';

interface Props {
  justify?: string;
  align?: string;
  direction?: string;
  nowrap?: boolean;
}

const Flex = styled.div<Props>`
  display: flex;
  flex-direction: ${props => props.direction};
  justify-content: ${props => props.justify};
  align-items: ${props => props.align};
  flex-wrap: ${props => props.nowrap ? 'no-wrap' : 'wrap'};
`

export default Flex;