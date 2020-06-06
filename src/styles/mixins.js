import { css } from "styled-components"
import theme from "./theme"
import media from "./media"
const { colors, fontSizes } = theme

const mixins = {
  flexCenter: css`
    display: flex;
    justify-content: center;
    align-items: center;
  `,

  flexBetween: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,

  outline: css`
    outline: 1px solid red;
  `,

  link: css`
    display: inline-block;
    font-size: ${fontSizes.xlarge};
    text-decoration: none;
    box-shadow: none;
    :link,
    :visited {
      color: ${colors.navy};
    }
    :hover,
    :active {
      color: ${colors.red};
    }
  `,

  inlineLink: css`
    display: inline-block;
    font-size: inherit;
    text-decoration: none;
    box-shadow: none;
    :link,
    :visited {
      color: ${colors.navy};
    }
    :hover,
    :active {
      color: ${colors.red};
    }
  `,

  smallButton: css`
    color: ${colors.green};
    background-color: transparent;
    border: 1px solid ${colors.green};
    border-radius: ${theme.borderRadius};
    padding: 0.75rem 1rem;
    font-size: ${fontSizes.smallish};
    ${"" /* font-family: ${fonts.SFMono}; */}
    line-height: 1;
    text-decoration: none;
    cursor: pointer;
    transition: ${theme.transition};
    &:hover,
    &:focus,
    &:active {
      background-color: ${colors.transGreen};
    }
    &:after {
      display: none !important;
    }
  `,

  bigButton: css`
    ${media.tablet`color: #E4E5E8;`};
    color: ${colors.slate};
    background-color: transparent;
    ${"" /* border: 1px solid ${colors.green}; */}
    border-radius: ${theme.borderRadius};
    padding: 1.25rem 1.75rem;
    font-size: ${fontSizes.small};
    ${"" /* font-family: ${fonts.SFMono}; */}
    line-height: 1;
    text-decoration: none;
    cursor: pointer;
    transition: ${theme.transition};
    &:hover,
    &:focus,
    &:active {
      ${"" /* background-color: ${colors.transGreen}; */}
    }
    &:after {
      display: none !important;
    }
  `,

  sidePadding: css`
    padding: 0 150px;
    ${media.desktop`padding: 0 100px;`};
    ${media.tablet`padding: 0 50px;`};
    ${media.phablet`padding: 0 25px;`};
  `,

  topPadding: css`
    padding: 50px 0;
    ${media.desktop`padding: 100px 0;`};
    ${media.tablet`padding: 50 0;`};
    ${media.phablet`padding: 25px 0;`};
    height: 100vh;
  `,

  boxShadow: css`
    box-shadow: 0 10px 30px -15px ${colors.shadowNavy};
    transition: ${theme.transition};

    &:hover,
    &:focus {
      box-shadow: 0 20px 30px -15px ${colors.shadowNavy};
    }
  `,
}

export default mixins
