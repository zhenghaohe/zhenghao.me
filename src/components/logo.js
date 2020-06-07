import React from "react"
import styled, { css } from "styled-components"
import { theme, media } from "@styles"

const { fontSizes, colors } = theme

export default () => (
  <button
    css={css`
      display: block;
      border: none;
      background-color: transparent;
    `}
  >
    <span
      css={css`
        background-color: ${colors.red};
        color: ${colors.offWhite};
      `}
    >
      Zhenghao
    </span>
    <span>'s Blog</span>
  </button>
)
