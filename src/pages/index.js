import React from "react"
import PageTransition from "gatsby-plugin-page-transitions"

import Layout from "@components/newLayout"
import Main from "@components/main"
import About from "@components/about"
import Footer from "@components/footer"
import Contact from "@components/contact"

import { GlobalStyle } from "@styles"

export default () => (
  <PageTransition>
    <Layout>
      <GlobalStyle />
      <Main />
      <About />
      <Contact />
      <Footer />
    </Layout>
  </PageTransition>
)
