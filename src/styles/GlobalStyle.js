import { createGlobalStyle } from "styled-components"

import media from "./media"

const GlobalStyle = createGlobalStyle`
 *,
      *::after,
      *::before {
        margin: 0;
        padding: 0;
        box-sizing: inherit;
      }

      html {
        font-size: 62.5%;
        ${media.tablet`
            font-size: 55%;
        `}
      }

      body {
        box-sizing: border-box;
        padding: 5rem;
        ${"" /* font-family: 'Source Code Pro' !important; */}

        ${media.tablet`
            padding: 0;
        `}
            ${"" /* color: ${colors.slate}; */}

      }
      a {
    box-shadow: none;
    cursor: pointer;
  }
`

export default GlobalStyle
