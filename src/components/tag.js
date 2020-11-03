import React from "react"
import styled, { css } from "styled-components"
import { theme, media } from "@styles"

const { fontSizes, colors } = theme
export default ({ type, location, position }) => (
  <Wrapper position={position}>
    <Tag type={type} location={location}>
      {type}
    </Tag>
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  justify-content: ${props =>
    props.position === "left" ? "flex-start" : "center"};
`
const Tag = styled.span`
  font-size: ${props =>
    props.location === "homepage" ? fontSizes.large : fontSizes.small};
  padding: ${props =>
    props.location === "homepage" ? "1.2rem 1.5rem " : "1rem 0.8rem;"};
  display: inline-flex;
  background-color: ${props =>
    props.type === "personal" ? colors.red : colors.navy};
  color: ${props =>
    props.type === "personal" ? colors.lightRed : colors.offWhite};
  height: 1.25rem;
  margin: 0.125rem;
  border-radius: 0.9375rem;
  align-items: center;
`
