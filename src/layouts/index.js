import React from "react"
import { Link } from "gatsby"
import styled, { css } from "styled-components"
import { rhythm, scale } from "../utils/typography"
import { theme, mixins } from "@styles"
import NavDot from "@components/nav-dot"

import Transition from "../components/transition"

const { colors, fontSizes } = theme

export default ({ children, location }) => {
  if (location.pathname.includes("blog")) {
    // Layout for blog
    const Footer = styled.footer`
      text-align: center;
      padding: 2rem;
    `
    const rootPath = `${__PATH_PREFIX__}/`
    const blogPath = `${__PATH_PREFIX__}/blog/`
    let header
    let Wrapper

    if (location.pathname === rootPath || location.pathname === blogPath) {
      Wrapper = styled.div`
        min-height: 100vh;
        margin-left: auto;
        margin-right: auto;
        max-width: ${rhythm(24)};
        padding: ${rhythm(1.5)} ${rhythm(3 / 4)};
      `

      header = (
        <h1
          style={{
            ...scale(1.8),
            marginTop: 0,
          }}
        >
          <Link
            css={css`
              box-shadow: none;
              text-decoration: none;
              color: inherit;
            `}
            to={location.pathname === blogPath ? `/blog/` : `/`}
          >
            Zhenghao's Blog
          </Link>
        </h1>
      )
    } else {
      // Full Bleed Style
      Wrapper = styled.div`
        min-height: 100vh;
        margin-left: auto;
        margin-right: auto;
        max-width: 100vw;
        figure {
          text-align: center;
          figcaption {
            color: grey;
            font-size: ${fontSizes.smallish};
            margin-top: 0.5rem;
          }
        }
      `
      header = (
        <h3
          style={{
            fontFamily: `Montserrat, sans-serif`,
            marginTop: "3rem",
            marginLeft: "3rem",
            marginBottom: "-3rem",
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/blog/`}
          >
            Zhenghao's Blog
          </Link>
        </h3>
      )
    }

    return (
      <Transition location={location}>
        <Wrapper>
          <header
            css={css`
          ${mixins.link}
          color: ${colors.navy};
          h1 {
            font-size: ${fontSizes.xxlarge} !important;

          }

        `}
          >
            {header}
          </header>
          <main
            css={css`
              a {
                ${mixins.inlineLink}
              }
              .blog-nav a {
                ${mixins.link}
              }
            `}
          >
            {children}
          </main>
          <Footer>© {new Date().getFullYear()}, Zhenghao He</Footer>
        </Wrapper>
      </Transition>
    )
  }

  // layout for homepage

  const Wrapper = styled.div`
    display: grid;
    grid-template-columns:
      [content-start] 12fr
      [content-end sidebar-start] 2fr [sidebar-end];
  `
  return (
    <Transition location={location}>
      <NavDot />
      <Wrapper>{children}</Wrapper>
    </Transition>
  )
}
