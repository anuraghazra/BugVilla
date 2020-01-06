import React from 'react';
import styled from 'styled-components/macro';

const StyledLoader = styled.div`
  .loader,
  .loader:before,
  .loader:after {
    border-radius: 50%;
    width:2em;
    height:2em;
    animation-fill-mode: both;
    animation: load7 1.8s infinite ease-in-out;
  }
  .loader {
    color: ${p => p.theme.colors.brand.secondary};
    font-size: 8px;
    margin: 40px auto;
    position: relative;
    text-indent: -9999em;
    transform: translateZ(0);
    animation-delay: -0.16s;
  }
  .loader:before,
  .loader:after {
    content: '';
    position: absolute;
    top: 0;
  }
  .loader:before {
    left: -3.5em;
    animation-delay: -0.32s;
  }
  .loader:after {
    left: 3.5em;
  }
  
  @keyframes load7 {
    0%,
    80%,
    100% {
      box-shadow: 0 2.5em 0 -1.3em;
    }
    40% {
      box-shadow: 0 2.5em 0 0;
    }
  }
`;

const Loading: React.FC = () => {
  return (
    <StyledLoader>
      <div className="loader">Loading...</div>
    </StyledLoader>
  );
};

export default Loading;
