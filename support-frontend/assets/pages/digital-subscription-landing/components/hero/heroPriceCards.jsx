// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { css } from '@emotion/core';
import { from, until } from '@guardian/src-foundations/mq';
import { brand } from '@guardian/src-foundations/palette';
import { space } from '@guardian/src-foundations';

import ProductOptionSmall from 'components/product/productOptionSmall';

const priceCardContainer = css`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 ${space[3]}px;
  margin: ${space[5]}px 0;
  margin-top: -${space[3]}px;

  ${from.tablet} {
    margin-top: ${space[2]}px;
    padding: 0 ${space[5]}px;
    border-top: none;
    border-left: 1px solid ${brand[600]};
  }
`;

const priceCardTopBorder = css`
  width: 100%;
  ${until.tablet} {
    border-top: 1px solid ${brand[600]};
  }
`;

const roundelContainer = css`
  position: absolute;
  right: -${space[2]}px;
  display: flex;
  align-items: center;
  width: auto;
  height: 100%;

  ${from.tablet} {
    display: none;
  }
`;

const fitAroundBelow = css`
  & > p:last-of-type {
    max-width: calc(100% - 80px);
  }
`;

const fitAroundAbove = css`
  & > p:first-of-type {
    max-width: calc(100% - 80px);
  }
`;

const product1 = {
  offerCopy: '50% off for 3 months',
  priceCopy: 'You\'ll pay £5.99/month for 3 months, then £11.99 per month',
  href: '',
  buttonCopy: 'Subscribe monthly for £5.99',
  onClick: () => {},
  onView: () => {},
};

const product2 = {
  offerCopy: 'Save 20% against monthly in the first year',
  priceCopy: 'You\'ll pay £99 for 1 year, then £119 per year',
  href: '',
  buttonCopy: 'Subscribe annually for £99',
  onClick: () => {},
  onView: () => {},
};

type PropTypes = {|
  roundel: Node,
|}


export function HeroPriceCards(props: PropTypes) {
  return (
    <div css={priceCardContainer}>
      <div css={priceCardTopBorder}>
        <div css={roundelContainer}>
          {props.roundel}
        </div>
        <ProductOptionSmall cssOverrides={fitAroundBelow} {...product1} />
        <ProductOptionSmall cssOverrides={fitAroundAbove} {...product2} />
      </div>
    </div>
  );
}
