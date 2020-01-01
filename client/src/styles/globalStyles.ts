import { createGlobalStyle } from 'styled-components';
import fontFaces from './fontFaces';
import utils from './utils.style';

const GlobalStyles = createGlobalStyle`
  ${fontFaces}
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
    color: ${p => p.theme.colors.text.black};
    background: ${p => p.theme.colors.common.white};
  }

  input, button, select, textarea, optgroup, option {
    font-family: inherit;
    font-weight: inherit;
    font-size: 14px;
    color: ${p => p.theme.colors.text.black};
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    line-height: 150%;
    letter-spacing: 1px;
    font-family: inherit;
    font-weight: inherit;
  }

  p, a {
    font-size: 16px;
  }
  a {
    text-decoration: none;
    line-height: 150%;
    color: ${p => p.theme.colors.text.black}
  }

  .svg-inline--fa {
    margin: 0px 5px
  }
  
`

export default GlobalStyles