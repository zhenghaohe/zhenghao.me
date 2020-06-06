import React from "react"
import styled from "styled-components"
import NavDot from "@components/nav-dot"

const Layout = ({ children }) => (
  <Wrapper>
    <NavDot />
    {children}
  </Wrapper>
)

export default Layout

const Wrapper = styled.div`
  display: grid;
  grid-template-columns:
    [content-start] 12fr
    [content-end sidebar-start] 2fr [sidebar-end];
`
