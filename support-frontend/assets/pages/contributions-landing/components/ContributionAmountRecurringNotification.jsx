// @flow

import React from 'react';
import { type ContributionType } from 'helpers/contributions';
import { textSans } from '@guardian/src-foundations/typography';
import { brand } from '@guardian/src-foundations/palette';
import { space } from '@guardian/src-foundations';
import { SvgInfo } from '@guardian/src-icons';
import { css } from '@emotion/core';

type ContributionAmountLabelProps = {
  formattedAmount: string,
  contributionType: ContributionType
};

const container = css`
  display: flex;
  align-items: flex-start;
  margin-top: ${space[3]}px;
  padding: ${space[1]}px ${space[3]}px;
  ${textSans.medium()}
  font-weight: bold;
  color: ${brand[400]};
  border: 4px solid ${brand[400]};
  border-radius: 4px;

  * + * {
    margin-left: ${space[1]}px;
  }
`;

const svgContainer = css`
  display: flex;
  svg {
    display: inline-block;
    width: 30px;
    height: 30px;
    fill: ${brand[400]};
  }
`;

const textContainer = css`
  margin-top: 2px;
`;

const ContributionAmountRecurringNotification = ({
  formattedAmount,
  contributionType,
}: ContributionAmountLabelProps) => {
  let frequency = '';
  if (contributionType === 'MONTHLY') {
    frequency = 'month';
  }
  if (contributionType === 'ANNUAL') {
    frequency = 'year';
  }

  return (
    <div css={container}>
      <div css={svgContainer}>
        <SvgInfo />
      </div>
      <div css={textContainer}>
        Every {frequency} you&apos;ll contribute {formattedAmount}.
      </div>
    </div>
  );
};

export default ContributionAmountRecurringNotification;
