import { DefaultTheme } from 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      brand: {
        primary: string;
        secondary: string;
        light: string;
        accent: string;
      },
      common: {
        white: string;
        offwhite: string;
        red: string;
        green: string;
        redlight: string;
        greenlight: string;
        cardBg: string;
      },
      text: {
        black: string;
        gray: string;
      }
    };
    font: {
      primary: string;
      primaryBold: string;
      primaryItalic: string;
      primaryMedium: string;
      primaryLight: string;
    };
    spacings: {
      top: number
      bottom: number
      left: number
      right: number
      my: string
      mx: string
    }
    border: string;
    media: {
      mobileS: string;
      mobile: string;
      tablet: string;
      desktop: string;
      desktopL: string;
    }
  }
}

const colors = {
  brand: {
    primary: '#586FFA',
    secondary: '#8B9AF4',
    light: '#A5B1FC',
    accent: '#E5E9FF',
  },
  common: {
    white: '#FBFBFF',
    offwhite: '#EAEEFF',
    red: '#FF5555',
    green: '#25B93E',
    redlight: '#FFDADA',
    greenlight: '#CEFDD7',
    cardBg: '#F7F8FF',
  },
  text: {
    black: '#3D3C47',
    gray: '#A5ADC6'
  }
};

const size = {
  mobileS: "320px",
  mobile: "425px",
  tablet: "768px",
  desktop: "1024px",
  desktopL: "1440px",
};

const theme: DefaultTheme = {
  font: {
    primary: 'Product Sans Regular',
    primaryBold: 'Product Sans Bold',
    primaryItalic: 'Product Sans Italic',
    primaryMedium: 'Product Sans Medium Regular',
    primaryLight: 'Product Sans Light Regular',
  },
  colors,
  spacings: {
    top: 40,
    bottom: 40,
    left: 25,
    right: 25,
    my: '20px',  
    mx: '20px', 
  },
  border: `2px solid ${colors.common.offwhite}`,
  media: {
    mobileS: `max-width: ${size.mobileS}`,
    mobile: `max-width: ${size.mobile}`,
    tablet: `max-width: ${size.tablet}`,
    desktop: `max-width: ${size.desktop}`,
    desktopL: `max-width: ${size.desktopL}`,
  }
}

export default theme;