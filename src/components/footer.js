import React from "react"
import styled from "styled-components"
import { css } from "styled-components"
import { theme, media } from "@styles"
import scrollTo from "gatsby-plugin-smoothscroll"

const { colors } = theme

export default () => {
  return (
    <Footer
      data-sal="fade"
      data-sal-delay="100"
      data-sal-easing="ease"
      data-sal-duration="500"
    >
      <FlexContainer>
        <li className="footer__item">
          <button
            className="footer__link"
            onClick={() => {
              scrollTo("#blog-list")
            }}
          >
            blog
          </button>
        </li>
        <li className="footer__item">
          <button
            className="footer__link"
            onClick={() => {
              scrollTo("#about-section")
            }}
          >
            about
          </button>
        </li>
        <li className="footer__item">
          <button
            className="footer__link"
            onClick={() => {
              scrollTo("#contact-section")
            }}
          >
            contact
          </button>
        </li>
      </FlexContainer>
    </Footer>
  )
}

const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 2.5rem;
  grid-column: content-start / content-end;
  ${media.tablet`
  grid-column: 1 / -1;
  height: 10rem;
  `};
  position: sticky;
  bottom: 0;
  height: 16rem;
  width: 100%;
  background-color: ${colors.lightNavy};
  z-index: 0;
`

const FlexContainer = styled.ul`
  padding: 2rem;
  display: flex;
  justify-content: flex-end;
  list-style: none;
  margin: 0;

  .footer__name {
    flex: 1;
  }

  .footer__item:not(:first-child) {
    margin-left: 2rem;
  }

  .footer__link {
    border: 0;
    background: inherit;
    cursor: pointer;
    border-radius: 0;
  }

  .footer__link:focus {
    outline: 0;
  }
  .footer__link:link,
  .footer__link:visited {
    color: ${colors.slate};
  }
  .footer__link:hover,
  .footer__link:active {
    color: ${colors.red};
  }
`
