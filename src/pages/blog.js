import React from "react"
import { Link, graphql } from "gatsby"
import PageTransition from "gatsby-plugin-page-transitions"
import { css } from "styled-components"
import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"
import Button from "../components/button"
import { theme } from "@styles"

const { colors, fontSizes } = theme

class Blog extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMdx.edges

    return (
      <PageTransition transitionTime={500}>
        <div
          css={css`
            /* background: ${colors.offWhite}; */
          `}
        >
          <Layout location={this.props.location} title={siteTitle}>
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
                    <p
                      dangerouslySetInnerHTML={{
                        __html: node.frontmatter.description || node.excerpt,
                      }}
                    />
                  </div>
                )
              })}
            </div>
            <Link to="/">
              <Button marginTop="85px">Go Home</Button>
            </Link>
          </Layout>
        </div>
      </PageTransition>
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
          }
        }
      }
    }
  }
`
