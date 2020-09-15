// @flow

import React from 'react';
import { css } from '@emotion/core';
import { headline, body, textSans } from '@guardian/src-foundations/typography/obj';
import { space } from '@guardian/src-foundations';
import { background, text, neutral } from '@guardian/src-foundations/palette';
import { from, between, until } from '@guardian/src-foundations/mq';

import typeof GridImageType from 'components/gridImage/gridImage';
import { type GridImg } from 'components/gridImage/gridImage';


export const wrapper = css`
  display: none;

  ${from.tablet} {
    display: block;
    background-color: ${background.primary};
    color: ${text.primary};
    ${until.desktop} {
      padding: ${space[3]}px;
    }
  }
`;

export const topLine = css`
  display: flex;
  justify-content: space-between;
  width: calc(100%-${space[3]}px * 2);
  align-items: center;
  padding: ${space[3]}px;

  ${until.desktop} {
    border-top: 1px solid ${neutral['93']};
    padding: ${space[1]}px 0 ${space[2]}px;
  }


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

  ${from.tablet} {
    display: block;
  }
`;

export const imageContainer = css`
  display: inline-flex;
  align-items: flex-start;
  width: 100%;
  padding: ${space[4]}px ${space[3]}px 0;
  background-color: ${neutral['97']};

  img {
    width: 100%;
    height: auto;
  }
`;

export const textBlock = css`
  margin-left: ${space[3]}px;

  ${from.desktop} {
    margin: ${space[3]}px;
  }

  h3 {
    ${body.medium({ fontWeight: 'bold' })};
    margin: -5px 0 -3px;
    ${from.desktop} {
      ${headline.xxsmall({ fontWeight: 'bold' })};
      margin-top: 0;
    }
  }

`;


type PropTypes = {
  title: string,
  image: $Call<GridImageType, GridImg>,
};

function OrderSummaryThankYou(props: PropTypes) {

  return (
    <aside css={wrapper}>
      <div css={topLine}>
        <h2 css={sansTitle}>Order confirmed</h2>
      </div>
      <div css={contentBlock}>
        <div css={imageContainer}>{props.image}</div>
        <div css={textBlock}>
          <h3>{props.title}</h3>
        </div>
      </div>
    </aside>
  );
}


export default OrderSummaryThankYou;
