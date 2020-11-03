import React from "react"
import styled from "styled-components"
import { theme, media } from "@styles"

const { colors } = theme

export default () => {
  return (
    <ContactSection id="contact-section">
      <h1
        class="contact-heading"
        data-sal="fade"
        data-sal-delay="300"
        data-sal-duration="1000"
      >
        contact
      </h1>
      <div
        class="contact-info"
        data-sal="slide-up"
        data-sal-delay="300"
        data-sal-duration="1000"
      >
        <p class="address">vancouver, bc</p>
        <p class="email">zhenghaohe17@gmail.com</p>
      </div>
    </ContactSection>
  )
}

const ContactSection = styled.section`
  padding: 2.5rem;
  color: ${colors.offWhite};
  grid-column: content-start / content-end;
  ${media.tablet`grid-column: 1 / -1;`};
  width: 100%;
  min-height: 50vh;
  background-color: ${colors.navy};
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .contact-heading {
    font-size: 5.5rem;
    font-weight: 400;
  }
  .contact-info {
    font-size: 1.6rem;
  }

  .contact-info > * {
    margin: 1rem 0;
  }
`
