import React from "react"
import { Link, graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import styled from "styled-components"
import Bio from "../components/bio"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"
import Tag from "@components/tag"
import { theme, mixins, media } from "@styles"

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.mdx
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext

    return (
      <>
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
        />
        <TitleContainer>
          <h1>{post.frontmatter.title}</h1>
          <p
            style={{
              ...scale(-1 / 5),
              display: `block`,
              marginBottom: rhythm(1),
              marginTop: rhythm(-1),
              marginBottom: rhythm(-0.1),
            }}
          >
            {post.frontmatter.date}
          </p>
          <Tag type={post.frontmatter.tag} location="blog" positon="center" />
        </TitleContainer>
        <Wrapper>
          <MDXRenderer>{post.body}</MDXRenderer>
        </Wrapper>
        <hr
          style={{
            marginBottom: rhythm(1),
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
    margin: 0;
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
    border-right: 2px solid var(--yellow);
  }

  .tip-right {
    grid-column: span 1 / -1;
    border-left: 2px solid var(--yellow);
  }

  a {
    color: black;
    text-decoration: underline wavy yellowgreen;
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
