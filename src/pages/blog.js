import React from "react"
import { Link, graphql } from "gatsby"
import { css } from "styled-components"
import Bio from "../components/bio"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"
import Button from "../components/button"
import { theme } from "@styles"
import Tag from "@components/tag"
const { colors, fontSizes } = theme

class Blog extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMdx.edges

    return (
      <div>
        <SEO title="All posts" />
        <Bio />
        <div
          css={css`
              margin: "20px 0 40px";
              /* font-size: ${fontSizes.large}; */
              h3 {
                /* font-size: ${fontSizes.xlarge}; */
                a:link,
                a:visited {
                  color: ${colors.slate};
                }
                a:hover,
                a:active {
                  color: ${colors.red};
                }
              }
              small {
                font-size: ${fontSizes.medium};
              }
            `}
        >
          {posts.map(({ node }) => {
            const title = node.frontmatter.title || node.fields.slug
            return (
              <div key={node.fields.slug}>
                <h3
                  style={{
                    marginBottom: rhythm(1 / 4),
                  }}
                >
                  <Link
                    style={{ boxShadow: `none` }}
                    to={`blog${node.fields.slug}`}
                  >
                    {title}
                  </Link>
                </h3>
                <small>{node.frontmatter.date}</small>
                <Tag type={node.frontmatter.tag} location="blog" />
                <p
                  dangerouslySetInnerHTML={{
                    __html: node.frontmatter.description || node.excerpt,
                  }}
                  css={css`
                    margin-top: 0.5rem;
                  `}
                />
              </div>
            )
          })}
        </div>
        <Link to="/">
          <Button marginTop="85px">Go Home</Button>
        </Link>
      </div>
    )
  }
}

export default Blog

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            tag
          }
        }
      }
    }
  }
`
