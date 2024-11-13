import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

  body {
    margin: 1;
    padding: 1;
    box-sizing: border-box;
    font-family: "Roboto", sans-serif;
    width: 100vw;
    height: 100vh;
  }

  .content {
  margin: 1rem;
  }

  .link {
   text-decoration: none;
    color: inherit;
    all: unset;
  }

  *, *::before, *::after {
    box-sizing: inherit;
  }

`;

export default GlobalStyle;
