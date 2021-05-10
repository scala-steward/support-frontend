// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import { css } from '@emotion/core';
import { headline } from '@guardian/src-foundations/typography';
import { space } from '@guardian/src-foundations';
import { border, brandAlt, neutral, sport } from '@guardian/src-foundations/palette';
import { from, until } from '@guardian/src-foundations/mq';


const quoteFigure = css`
  background-color: ${neutral[100]};
  position: relative;
  padding: ${space[2]}px;
  margin-bottom: ${space[9]}px;
  border: 1px solid ${border.secondary};
`;

const quoteText = css`
  display: flex;
  ${headline.xxxsmall()};
  margin-bottom: ${space[1]}px;

  ${from.mobileMedium} {
    margin-bottom: -${space[2]}px;
  }

  ${from.tablet} {
    ${headline.xsmall()};
  }

  strong {
    font-weight: 700;
  }
`;

const quoteAttribution = css`
  ${headline.xxxsmall({ fontStyle: 'italic' })};
  margin-bottom: ${space[6]}px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  min-height: 68px;

  ${until.tablet} {
    font-size: 15px;
  }

  span {
    display: block;
  }
`;

const quoteJobTitle = css`
  color: ${sport[300]};
`;

const quoteHeadshot = css`
  display: flex;
  height: 68px;
  width: 68px;
  background-color: ${brandAlt[400]};
  border-radius: 50%;
`;

const quoteTail = css`
  position: absolute;
  bottom: 1px;
  left: ${space[6]}px;
  width: ${space[9]}px;
  height: ${space[9]}px;
  border: 1px solid ${border.secondary};
  border-top: none;
  border-radius: 0px 0px 51px 0px;
  transform: translateY(100%);
  background-color: inherit;
`;

type PropTypes = {|
  children: Node;
  name: string;
  jobTitle: string;
  headshot?: Node;
|}

function Quote({
  children, name, jobTitle, headshot,
}: PropTypes) {
  return (
    <figure css={quoteFigure}>
      <blockquote css={quoteText}>
        {children}
      </blockquote>
      <figcaption css={quoteAttribution}>
        <div>
          <span>{name}</span>
          <span css={quoteJobTitle}>{jobTitle}</span>
        </div>
        {headshot &&
          <div css={quoteHeadshot}>
            {headshot}
          </div>
        }
      </figcaption>
      <div css={quoteTail} />
    </figure>
  );
}

Quote.defaultProps = {
  headshot: null,
};

export default Quote;
