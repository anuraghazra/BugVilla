import React from 'react';
import styled from 'styled-components/macro';

const StyledLoader = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 70vh;
  
  .loader {
    margin: auto;
    width: 50px;
    height: 50px;
    border: 5px solid ${p => p.theme.colors.brand.accent};
    border-top-color: ${p => p.theme.colors.brand.primary};
    border-radius: 50%;
    animation: rotation 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.1) infinite;
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Loading: React.FC = () => {
  return (
    <StyledLoader>
      <div className="loader"></div>
    </StyledLoader>
  );
};

export default Loading;
