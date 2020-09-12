import { createGlobalStyle } from 'styled-components';
// import fontFaces from './fontFaces';
import utils from './utils.style';

/* ${fontFaces} */
const GlobalStyles = createGlobalStyle`
  ${utils}

  * {
    box-sizing: border-box;
  }
  
  html, body {
    font-size: calc(12px + 0.4vw);
    font-family: ${p => p.theme.font.primary};
    font-display: fallback !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    padding: 0;
    margin: 0;
  }

  body {
    font-family: inherit;
    height: 100vh;
    color: ${p => p.theme.colors.black};
    background: ${p => p.theme.colors.white};
  }

  input, button, select, textarea, optgroup, option {
    font-family: inherit;
    font-weight: inherit;
    font-size: 14px;
    color: ${p => p.theme.colors.black};
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    line-height: 1.5em;
    letter-spacing: 0px;
    font-family: inherit;
    font-weight: inherit;
  }

  p, a {
    font-size: 16px;
  }

  a {
    text-decoration: none;
    line-height: 1.5em;
    color: ${p => p.theme.colors.black};
  }

  code, pre {
    line-height: 150%;
    white-space: pre-wrap;
    width: 100%;
    overflow-x: scroll !important;
    font-size: 14px;
    background: white !important;
  }

  .svg-inline--fa {
    margin: 0px 5px
  }
  
  .markdown-preview {
    margin-bottom: 20px;
    img {
      width: 50%;
    }

    a {
      position: relative;
      color: ${p => p.theme.colors.primary};

      &:before {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0%;
        height: 2px;
        background-color: ${p => p.theme.colors.primary};
        transition: 0.2s;
      }
      &:hover:before {
        width: 100%;
        transition: 0.2s;
      }
    }
  }


  .Modal {
    position: absolute;
    border-radius: 5px;
    padding: 30px 40px;
    border: ${p => p.theme.border};
    background-color: ${p => p.theme.colors.white};
    box-shadow: 0 8px 25px 0px rgba(0,0,0,0.1);
    &:focus {
      outline: none;
    }
  }

  .Overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    /* background-color: rgba(88,111,253,0.2); */
  }

  .ReactModal__Overlay {
    opacity: 0;
    transform: translateY(25px);
    transform-origin: center;
    transition: .3s;
  }

  .ReactModal__Overlay--after-open {
      opacity: 1;
      transform: translateY(0px);
  }

  .ReactModal__Overlay--before-close{
      opacity: 0;
      transform: translateY(25px);
  }

  .toast-notification {
    span {
      border-radius: 50px !important;
      padding: 15px !important;
    }
  }
`;

export default GlobalStyles;
