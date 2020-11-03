import React from "react"
import Main from "@components/main"
import About from "@components/about"
import Footer from "@components/footer"
import Contact from "@components/contact"

import { GlobalStyle } from "@styles"

import { Helmet } from "react-helmet"

export default () => (
  <>
    <Helmet>
      <link
        href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap"
        rel="stylesheet"
      />
    </Helmet>
    <GlobalStyle />
    <Main />
    <About />
    <Contact />
    <Footer />
  </>
)
