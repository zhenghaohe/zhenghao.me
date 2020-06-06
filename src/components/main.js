import React from "react"
import styled from "styled-components"
import { css } from "styled-components"
import { theme, media } from "@styles"
import BlogList from "@components/blog-list"

const { colors } = theme

const Main = () => {
  return (
    <MainSection id="main-section">
      <div
        className="intro"
        css={css`
          grid-column: span 5 / col-end 8;
          grid-row-start: 1;
        `}
      >
        <div
          css={css`
            margin-top: 50vh;
            margin-bottom: 20vh;
            ${media.tablet`margin-top: clamp(60vw, 60vh, 80vw);`};
          `}
          data-sal="fade"
          data-sal-delay="100"
          data-sal-duration="1000"
        >
          <h1
            className="heading"
            css={css`
              font-size: 7rem;
              ${media.tablet`
              font-size: 5rem;
              `};
              font-weight: inherit;
            `}
          >
            Zhenghao He
          </h1>
          <h2
            className="job-title"
            css={css`
              font-size: 3rem;
              font-weight: inherit;
              ${media.tablet`
              font-size: 2rem;
              `};
            `}
          >
            Front-End Software Engineer
          </h2>
          <h3
            className="description"
            css={css`
              margin-top: 3rem;
              font-size: 5rem;
              ${media.tablet`
              font-size: 4rem;
              `};
            `}
          >
            I build things.
          </h3>
        </div>
        <BlogList />
      </div>
    </MainSection>
  )
}

export default Main

const MainSection = styled.section`
  width: 100%;
  background-color: ${colors.offWhite};
  grid-column: content-start / content-end;
  display: grid;
  grid-template-columns:
    1fr repeat(8, [col-start] minmax(min-content, 10rem) [col-end])
    1fr;
  align-items: center;
  ${media.tablet`grid-column: 1 / -1;`};
`
