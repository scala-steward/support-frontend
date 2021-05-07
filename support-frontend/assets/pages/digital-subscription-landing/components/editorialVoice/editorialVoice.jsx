// @flow

import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { headline } from '@guardian/src-foundations/typography';
import { neutral, text } from '@guardian/src-foundations/palette';
import { from } from '@guardian/src-foundations/mq';

import Block from 'components/page/block';
import Quote from 'components/quote/quote';

const blockOverrides = css`
  position: relative;
  padding: 0 !important;
  margin-top: 66px;
`;

const evLabel = css`
  position: absolute;
  top: 0;
  left: -1px;
  transform: translateY(-100%);
  padding: ${space[1]}px ${space[2]}px;
  ${headline.xxsmall({ fontWeight: 'bold' })};
  background-color: ${neutral[0]};
  color: ${text.ctaPrimary};

  ${from.desktop} {
    ${headline.xsmall({ fontWeight: 'bold' })};
  }
`;

const evContainer = css`
  display: flex;
  align-items: flex-start;
`;

const evImageContainer = css`
  display: flex;
  align-items: flex-start;
  margin-left: -${space[9]}px;
  height: 316px;

  ${from.desktop} {
    height: 376px;
    margin-left: ${space[12]}px;
  }

  img {
    max-height: 100%;
  }
`;

const evQuotePadding = css`
  padding: ${space[4]}px ${space[4]}px 0;

  ${from.desktop} {
    padding-top: 56px;
    padding-left: 56px;
    padding-right: 80px;
  }
`;

function EditorialVoice() {
  return (
    <Block cssOverrides={blockOverrides}>
      <div css={evLabel}>Why your support matters</div>
      <div css={evContainer}>
        <div css={evImageContainer}>
          <img src="https://media.guim.co.uk/fe925780346f02f20530eadc6890c40946c3c88b/0_0_137_376/137.png" alt="" />
        </div>
        <div css={evQuotePadding}>
          <Quote name="Damian Carrington" jobTitle="Environment Editor">
            The biggest story of the 21st Century is the climate crisis; reporting on global,
            slow-motion disasters requires long-term commitment.{' '}
            <strong>The secure foundation Guardian subscribers provide is essential to us.</strong>
          </Quote>
        </div>
      </div>
    </Block>
  );
}

export default EditorialVoice;
