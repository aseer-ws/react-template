import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Montserrat', sans-serif;;
  }

  body.fontLoaded {
    font-family: 'Montserrat', sans-serif;;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

  p,
  span,
  button,
  label {
    font-family:'Montserrat', sans-serif;;
    line-height: 1.5em;
    margin-bottom: 0;
  }
`;

export default GlobalStyle;
