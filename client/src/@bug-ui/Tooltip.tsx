import React from 'react';
import styled from 'styled-components';

const TooltipWrapper = styled.div`
  position: relative;
  cursor: pointer;

  .tooltip--content {
    position: absolute;
    width: max-content;
    max-width: 150px;
    top: 100%;
    left: 50%;
    padding: 8px 10px;
    padding-bottom: 10px;
    margin-top: 5px;
    border-radius: 5px;
    border: 2px solid ${p => p.theme.colors.offwhite};
    background-color: ${p => p.theme.colors.white};
    transform: translate(-50%, 0);
    opacity: 0;
    text-align: center;
    pointer-events: none;
    transition: 0.3s;
  }

  &:hover .tooltip--content {
    opacity: 1;
    pointer-events: all;
    transition: 0.3s;
  }
`;

interface TooltipProps {
  content: React.ReactNode;
  [x: string]: any;
}
export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  ...props
}) => {
  return (
    <TooltipWrapper data-testid="tooltip" {...props}>
      <div className="tooltip--content">{content}</div>
      {children}
    </TooltipWrapper>
  );
};

export default Tooltip;
