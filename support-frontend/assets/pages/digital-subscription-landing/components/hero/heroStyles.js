// @flow

// ----- Imports ----- //

import { css } from '@emotion/core';

import { headline, titlepiece, body } from '@guardian/src-foundations/typography';
import { brand, neutral, brandAlt } from '@guardian/src-foundations/palette';
import { from } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';

export const wrapper = css`
  position: relative;
  background: #ededed;
  display: flex;
  flex-direction: column;
  padding-top: ${space[4]}px;

  :before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 170px;
    background: ${brand[300]};
    content: '';
  }

  ${from.mobileLandscape} {
    :before {
      height: 200px;
    }
  }

  ${from.desktop} {
    :before {
      height:200px;
    }
  }
`;

export const pageTitle = css`
  ${headline.large({ fontWeight: 'bold' })};
  color: ${neutral[97]};
  z-index: 10;
  background-color: transparent;
  padding: 0 ${space[4]}px ${space[9]}px;
  width: 100%;

  ${from.mobileLandscape} {
    padding-bottom: ${space[12]}px;
  }

  ${from.phablet} {
    width: 100%;
    align-self: center;
  }

  ${from.tablet} {
    width: calc(100% - 40px);
  }

  ${from.desktop} {
    ${titlepiece.large()}
    max-width: calc(100% - 110px);
    max-width: 1100px;
    padding: 0 ${space[4]}px ${space[12]}px;
  }

  ${from.leftCol} {
    width: calc(100% - 80px);
    max-width: 80.625rem;
  }
`;

export const featureContainer = css`
  position: relative;
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  background-color: #00568D;
  color: ${neutral[97]};
  padding: ${space[4]}px;
  padding-bottom: 0;
  width: 100%;

  ${from.phablet} {
    display: inline-flex;
    flex-direction: row;
    width: 100%;
    align-self: center;
    padding: 0 ${space[4]}px;
  }

  ${from.tablet} {
    width: calc(100% - 40px);
  }

  ${from.desktop} {
    justify-content: space-between;
    max-width: calc(100% - 110px);
    max-width: 1100px;
  }

  ${from.leftCol} {
    width: calc(100% - 80px);
    max-width: 80.625rem;
  }
`;

export const textSection = css`
  width: 100%;

  ${from.phablet} {
    padding: ${space[4]}px 0;
    width: 60%;
  }

  ${from.tablet} {
    width: 60%;
  }

  ${from.desktop} {
    width: 65%;
  }

  ${from.leftCol} {
    width: 55%;
  }
`;

export const heroHeading = css`
  ${headline.xsmall({ fontWeight: 'bold' })};
  max-width: 100%;
  margin-bottom: ${space[5]}px;

  ${from.mobileMedium} {
    ${headline.small({ fontWeight: 'bold' })};
  }

  ${from.mobileLandscape} {
    ${headline.medium({ fontWeight: 'bold' })};
  }

  ${from.desktop} {
    ${headline.large({ fontWeight: 'bold' })};
    margin-bottom: 20px;
  }

  ${from.leftCol} {
    margin-top: 0;
    margin-bottom: 50px;
  }

  ${from.wide} {
    margin-bottom: 60px;
  }
`;

export const yellowHeading = css`
  color: ${brandAlt[400]};
`;

export const paragraph = css`
  ${body.small()};
  max-width: 100%;
  margin-bottom: ${space[5]}px;

  ${from.mobileMedium} {
    ${body.medium()};
  }

  ${from.phablet} {
    ${body.medium()};
    max-width: 95%;
  }

  ${from.tablet} {
    max-width: 100%;
  }

  ${from.desktop} {
    ${headline.xsmall()};
    line-height: 135%;
    max-width: 95%;
  }

  ${from.leftCol} {
    max-width: 90%;
  }

  ${from.wide} {
    max-width: 80%;
  }
`;

export const heavyText = css`
  font-weight: 600;
`;

export const packShot = css`
  display: flex;
  align-self: flex-end;
  width: 100%;
  margin-top: ${space[5]}px;

  img {
    width: 100%;
  }

  ${from.phablet} {
    display: inline-flex;
    max-width: 40%;
    margin-top: 0;

    img {
      width: 105%;
    }
  }

  ${from.tablet} {
    img {
      width: 100%;
    }
  }

  ${from.desktop} {
    max-width: 35%;
  }

  ${from.leftCol} {
    max-width: 460px;
  }
`;

export const circle = css`
  display: none;

  ${from.phablet} {
    display: flex;
    flex-direction: column;
    position: absolute;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 50%;
    background-color: ${brandAlt[400]};
    height: 130px;
    width: 130px;
    right: 20px;
    top: -40px;
  }

  ${from.tablet} {
    top: -50px;
  }

  ${from.desktop} {
    top: -70px;
  }
`;

export const circleTextTop = css`
  ${headline.medium({ fontWeight: 'bold' })};
  color: ${brand[300]};
`;

export const circleTextBottom = css`
  ${headline.xsmall({ fontWeight: 'bold' })};
  color: ${brand[300]};
`;
