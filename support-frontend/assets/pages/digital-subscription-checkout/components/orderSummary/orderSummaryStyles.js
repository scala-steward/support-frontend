import { css } from '@emotion/core';
import { headline, body, textSans } from '@guardian/src-foundations/typography/obj';
import { space } from '@guardian/src-foundations';
import { background, brandAltBackground, text } from '@guardian/src-foundations/palette';
import { from, between, until } from '@guardian/src-foundations/mq';

export const wrapper = css`
  background-color: ${background.primary};
  color: ${text.primary};
  padding-bottom: ${space[3]}px;
`;

export const topLine = css`
  display: flex;
  justify-content: space-between;
  width: calc(100%-${space[3]}px * 2);
  margin: ${space[3]}px;
  align-items: center;

  a, a:visited {
    display: block;
    ${textSans.small()};
    color: ${text.primary};
    ${from.desktop} {
      ${textSans.medium({ fontWeight: 'bold' })};
    }
  }

  ${between.phablet.and.desktop} {
    display: block;
  }
`;

export const sansTitle = css`
  ${textSans.medium({ fontWeight: 'bold' })};
  ${from.phablet} {
    ${textSans.large({ fontWeight: 'bold' })};
  }
`;

export const contentBlock = css`
  display: flex;
  width: 100%;
  margin-bottom: ${space[3]}px;

  ${from.tablet} {
    display: block;
  }
`;

export const imageContainer = css`
  display: inline-flex;
  align-items: flex-start;
  width: calc(100%-30px);
  padding: 15px 10px 0 15px;
  background-color: #63717A;

  img {
    width: 100%;
    height: auto;

  }

  ${until.tablet} {
    width: 65px;
    height: 73px;
    padding-top: 8px;
    padding-left: 8px;
    overflow: hidden;
    margin-left: ${space[3]}px;
    img {
      width: 200%;
      align-items: flex-end;
    }
  }
`;

export const textBlock = css`
  margin-left: ${space[3]}px;

  ${from.desktop} {
    display: flex;
    justify-content: space-between;
    width: calc(100%-${space[3]}px * 2);
    margin: ${space[3]}px;
    align-items: baseline;
  }

  h3 {
    ${body.medium({ fontWeight: 'bold' })};
    margin-top: -5px;
    ${from.desktop} {
      ${headline.xxsmall({ fontWeight: 'bold' })};
      margin-top: 0;
    }
  }
  p, span {
    max-width: 240px;
  }
  span {
    background-color: ${brandAltBackground.primary};
    padding: 2px;
    ${textSans.small({ fontWeight: 'bold' })};
    ${from.desktop} {
      padding: ${space[1]}px;
      ${textSans.medium()};
    }
  }
  p {
    ${body.small({ fontWeight: 'normal' })};
    line-height: 135%;
    ${from.desktop} {
      display: none;
    }
  }
`;

export const endSummary = css`
  display: none;

  ${from.desktop} {
    display: block;
  }
`;
