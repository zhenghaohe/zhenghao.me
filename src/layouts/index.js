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
    const Wrapper = styled.div`
      min-height: 100vh;
      figure {
        text-align: center;
        figcaption {
          color: grey;
          font-size: ${fontSizes.smallish};
          margin-top: 0.5rem;
        }
      }
    `

    const Footer = styled.footer`
      text-align: center;
      padding: 2rem;
    `
    const rootPath = `${__PATH_PREFIX__}/`
    const blogPath = `${__PATH_PREFIX__}/blog/`
    let header

    if (location.pathname === rootPath || location.pathname === blogPath) {
      header = (
        <h1
          style={{
            ...scale(1.8),
            marginBottom: rhythm(1.5),
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={location.pathname === blogPath ? `/blog/` : `/`}
          >
            title
          </Link>
        </h1>
      )
    } else {
      header = (
        <h3
          style={{
            fontFamily: `Montserrat, sans-serif`,
            marginTop: 0,
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
            title
          </Link>
        </h3>
      )
    }

    return (
      <Transition location={location}>
        <Wrapper>
          <div
            style={{
              marginLeft: `auto`,
              marginRight: `auto`,
              maxWidth: rhythm(24),
              padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
            }}
          >
            <header
              css={css`
          ${mixins.link}
          color: ${colors.navy};
          h1 {
            font-size: ${fontSizes.xxxlarge} !important;

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
          </div>
          <Footer>
            © {new Date().getFullYear()}, Built with
            <a href="https://www.gatsbyjs.org">Gatsby</a>
          </Footer>
        </Wrapper>
      </Transition>
    )
  }

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
