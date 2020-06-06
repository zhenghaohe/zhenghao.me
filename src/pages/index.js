import React from "react"
import Main from "@components/main"
import About from "@components/about"
import Footer from "@components/footer"
import Contact from "@components/contact"

import { GlobalStyle } from "@styles"

export default () => (
  <>
    <GlobalStyle />
    <Main />
    <About />
    <Contact />
    <Footer />
  </>
)
