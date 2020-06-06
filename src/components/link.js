import styled from "@emotion/styled"
import { Link } from "gatsby"
import { theme } from "@styles"

const { fontSizes, colors } = theme

const HomePageLink = styled(Link)`
  display: inline-block;
  font-size: ${fontSizes.xxlarge};
  text-decoration: none;
  box-shadow: none;
  :link,
  :visited {
    color: ${colors.slate};
  }
  :hover,
  :active {
    color: ${colors.red};
  }
`

export default HomePageLink
