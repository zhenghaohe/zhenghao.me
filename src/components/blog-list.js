import React from "react"
import { StaticQuery, graphql, Link } from "gatsby"
import styled, { css } from "styled-components"

import { theme, media } from "@styles"

import Button from "@components/button"
import HomePageLink from "@components/link"
import Tag from "./tag"

const { fontSizes } = theme

export default () => {
  return (
    <StaticQuery
      query={blogListQuery}
      render={data => {
        const siteTitle = data.site.siteMetadata.title
        const posts = data.allMdx.edges
        return (
          <BlogContainer
            id="blog-list"
            data-sal="slide-up"
            data-sal-delay="50"
            data-sal-duration="1000"
            data-sal-easing="ease"
          >
            {posts.map(({ node }) => {
              const title = node.frontmatter.title || node.fields.slug
              return (
                <div key={node.fields.slug}>
                  <h3>
                    <HomePageLink to={`blog${node.fields.slug}`}>
                      {title}
                    </HomePageLink>
                  </h3>
                  <span
                    css={css`
                      margin: 0.3rem 0;
                    `}
                  >
                    {node.frontmatter.date}
                  </span>
                  <Tag
                    type={node.frontmatter.tag}
                    location="homepage"
                    position="left"
                  />
                  <p
                    dangerouslySetInnerHTML={{
                      __html: node.frontmatter.description || node.excerpt,
                    }}
                    css={css`
                      margin-top: 0.3rem;
                    `}
                  />
                </div>
              )
            })}
            <Link to="/blog/">
              <Button marginTop="4rem" marginBottom="4rem">
                read my blog
              </Button>
            </Link>
          </BlogContainer>
        )
      }}
    />
  )
}

const BlogContainer = styled.div`
  padding-right: 1rem;
  font-size: ${fontSizes.xlarge};
  h3 a {
    font-size: ${fontSizes.xxxlarge} !important;
  }
  ${media.tablet`
  h3 {
    font-size: ${fontSizes.xxlarge};
  }
  p {
    font-size: ${fontSizes.xlarge};
  }
  `};
`

const GoToBlogBtn = styled(HomePageLink)`
  font-size: ${fontSizes.xxlarge} !important;
  margin: 5rem auto;
`

const blogListQuery = graphql`
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
