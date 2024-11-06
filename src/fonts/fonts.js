import { createGlobalStyle } from "styled-components";

import MulishBold from "./Mulish/Mulish-Bold.ttf";
import MulishExtraBold from "./Mulish/Mulish-ExtraBold.ttf";
import MulishBlack from "./Mulish/Mulish-Black.ttf";
import MulishExtraLight from "./Mulish/Mulish-ExtraLight.ttf";
import MulishLight from "./Mulish/Mulish-Light.ttf";

import RobotoLightItalic from "./Roboto/Roboto-LightItalic.ttf";
import RobotoBlackItalic from "./Roboto/Roboto-BlackItalic.ttf";
import RobotoRegular from "./Roboto/Roboto-Regular.ttf";
import RobotoMedium from "./Roboto/Roboto-Medium.ttf";
import RobotoBold from "./Roboto/Roboto-Bold.ttf";
import RobotoBlack from "./Roboto/Roboto-Black.ttf";

const GlobalFonts = createGlobalStyle`
  
  @font-face {
    font-family: 'Mulish';
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: local('Mulish Bold'), local('Mulish-Bold'), url(${MulishBold}) format("truetype");
  }
  @font-face {
    font-family: 'Mulish';
    font-style: normal;
    font-weight: 300;
    font-display: swap;
    src: local('Mulish ExtraLight'), local('Mulish-ExtraLight'), url(${MulishExtraLight}) format("truetype");
  }
  @font-face {
    font-family: 'Mulish';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local('Mulish Light'), local('Mulish-Light'), url(${MulishLight}) format("truetype");
  }
  
  @font-face {
    font-family: 'Mulish';
    font-style: normal;
    font-weight: 800;
    font-display: swap;
    src: local('Mulish ExtraBold'), local('Mulish-ExtraBold'), url(${MulishExtraBold}) format("truetype");
  }
  
  @font-face {
    font-family: 'Mulish';
    font-style: normal;
    font-weight: 900;
    font-display: swap;
    src: local('Mulish Black'), local('Mulish-Black'), url(${MulishBlack}) format("truetype");
  }
  
  @font-face {
    font-family: 'Roboto';
    font-style: italic;
    font-weight: 300;
    font-display: swap;
    src: local('Roboto Light Italic'), local('Roboto-LightItalic'), url(${RobotoLightItalic}) format("truetype");
  }
  
  @font-face {
    font-family: 'Roboto';
    font-style: italic;
    font-weight: 900;
    font-display: swap;
    src: local('Roboto Black Italic'), local('Roboto-BlackItalic'), url(${RobotoBlackItalic}) format("truetype");
  }
  
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local('Roboto'), local('Roboto-Regular'), url(${RobotoRegular}) format("truetype");
  }
  
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    font-display: swap;
    src: local('Roboto Medium'), local('Roboto-Medium'), url(${RobotoMedium}) format("truetype");
  }
  
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: local('Roboto Bold'), local('Roboto-Bold'), url(${RobotoBold}) format("truetype");
  }
  
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 900;
    font-display: swap;
    src: local('Roboto Black'), local('Roboto-Black'), url(${RobotoBlack}) format("truetype");
  }
`;
export default GlobalFonts;
