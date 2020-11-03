import React from "react"
import { Link, graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { MDXProvider } from "@mdx-js/react"
import { createGlobalStyle } from "styled-components"
import styled, { css } from "styled-components"
import Bio from "../components/bio"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"
import Tag from "@components/tag"
import { theme, media } from "@styles"

const { colors, fontSizes } = theme
const GlobalStyle = createGlobalStyle`
@font-face {
    font-family: 'Source Code Pro';
    font-style: normal;
    font-weight: 400;
    src: url('../fonts/source-code-pro-v13-latin-regular.eot'); /* IE9 Compat Modes */
    src: local('Source Code Pro Regular'), local('SourceCodePro-Regular'),
        url('../fonts/source-code-pro-v13-latin-regular.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
        url('../fonts/source-code-pro-v13-latin-regular.woff2') format('woff2'), /* Super Modern Browsers */
        url('../fonts/source-code-pro-v13-latin-regular.woff') format('woff'), /* Modern Browsers */
        url('../fonts/source-code-pro-v13-latin-regular.ttf') format('truetype'), /* Safari, Android, iOS */
        url('../fonts/source-code-pro-v13-latin-regular.svg#SourceCodePro') format('svg'); /* Legacy iOS */
  }
  :root {
  --grvsc-line-highlighted-background-color: rgba(255, 255, 255, 0.1); /* default: transparent */
  --grvsc-line-highlighted-border-color: rgba(255, 255, 255, 0.5); /* default: transparent */
  --grvsc-line-highlighted-border-width: 2px; /* default: 4px */
}  
  code {
    font-size: 1rem !important;
    font-family: 'Source Code Pro' !important;
  }
`

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.mdx
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext

    return (
      <>
        <GlobalStyle />
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
        />
        <TitleContainer>
          <h1
            css={css`
              ${media.thone`
    font-size: ${fontSizes.large};

  `};
            `}
          >
            {post.frontmatter.title}
          </h1>
          <p
            style={{
              display: `block`,
              marginBottom: rhythm(1),
              marginTop: rhythm(-1),
              marginBottom: rhythm(-1 / 200),
            }}
          >
            {post.frontmatter.date}
          </p>
          <Tag type={post.frontmatter.tag} location="blog" positon="center" />
        </TitleContainer>
        <Wrapper>
          <MDXProvider
            components={{
              p: props => <p {...props} style={{ margin: 0 }} />,
              inlineCode: props => (
                <code
                  style={{
                    fontSize: "inherit",
                    background: colors.lightNavy,
                    padding: "0 0.25rem",
                  }}
                  {...props}
                />
              ),
            }}
          >
            <MDXRenderer>{post.body}</MDXRenderer>
          </MDXProvider>
        </Wrapper>
        <hr
          style={{
            marginBottom: rhythm(1),
            marginTop: rhythm(1),
          }}
        />
        <FooterContainer>
          <Bio />
          <ul
            style={{
              display: `flex`,
              flexWrap: `wrap`,
              justifyContent: `space-between`,
              listStyle: `none`,
              padding: 0,
              margin: 0,
            }}
          >
            <li>
              {previous && (
                <Link to={`blog${previous.fields.slug}`} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={`blog${next.fields.slug}`} rel="next">
                  {next.frontmatter.title} →
                </Link>
              )}
            </li>
          </ul>
        </FooterContainer>
      </>
    )
  }
}

const TitleContainer = styled.div`
  text-align: center;
`

const FooterContainer = styled.div`
  max-width: 80vw;
  margin: 0 auto;
`

const Wrapper = styled.article`
  display: grid;
  max-width: 95vw;
  margin: 3rem auto 0;
  grid-gap: 10px 50px;
  grid-template-columns: 3fr 12fr 3fr;
  grid-auto-rows: min-content;
  > * {
    grid-column: 2 / -2;
    ${media.thone`
    grid-column: 1 / -1;
  `};
  }

  > .full-bleed {
    grid-column: 1 / -1;
  }

  > blockquote {
    grid-column: 1 / -1;
    /* font-size: 60px; */
    font-style: italic;
    text-align: center;
    margin: 0;
  }

  .tip {
    background: #fafafa;
    padding: 10px;
    grid-row: span 5;
    align-self: start;
  }

  .tip-left {
    grid-column: 1 / span 1;
    text-align: right;
    border-right: 2px solid ${colors.navy};
    ${media.thone`
    grid-column: 1 / -1;
  `};
  }

  .tip-right {
    grid-column: span 1 / -1;
    border-left: 2px solid ${colors.navy};
    ${media.thone`
    grid-column: 1 / -1;
  `};
  }

  a {
    color: black;
    text-decoration: none;
    box-shadow: 0 1px 0 0 currentColor;
    background-position: bottom;
    background-size: 20%;
    transition: none;
  }
`

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    mdx(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      body
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        tag
      }
    }
  }
`
