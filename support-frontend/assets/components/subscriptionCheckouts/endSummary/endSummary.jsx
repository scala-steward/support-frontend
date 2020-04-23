// @flow

import React from 'react';
import * as styles from './endSummaryStyles';
import { connect } from 'react-redux';
import { cancellationCopy } from 'components/subscriptionCheckouts/cancellationPolicy';
import mapStateToProps from 'components/subscriptionCheckouts/endSummary/endSummarySelector';

import type { EndSummaryProps } from 'components/subscriptionCheckouts/endSummary/endSummarySelector';

const Dot = () => <div css={styles.dot} />;

function EndSummary({ priceDescription, promotion, displayPrice }: EndSummaryProps) {

  return (
    <ul css={styles.list}>
      <li css={styles.listMain}><Dot />14-day free trial</li>
      <li css={styles.listMain}>
        <span><Dot />{promotion !== null ? promotion : `${displayPrice}/month`}</span>
        <span css={styles.subText}>
          {promotion !== null && priceDescription ?
            `So you'll pay ${priceDescription}` :
            'Your first payment will occur after the 14-day trial ends'}
        </span>
      </li>
      <li css={styles.listMain}>
        <span><Dot />{cancellationCopy.title}</span>
        <span css={styles.subText}>
          {cancellationCopy.body}
        </span>
      </li>
    </ul>
  );
}

export default connect(mapStateToProps)(EndSummary);
