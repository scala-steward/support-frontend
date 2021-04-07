// @flow

// ----- Imports ----- //

// $FlowIgnore - required for hooks
import React, { useState } from 'react';
import { ThemeProvider } from 'emotion-theming';

import { Button, LinkButton, buttonBrand } from '@guardian/src-button';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { clickedCss, wrapper, buttonStyles, feedbackLink, header } from './feedbackWidgetStyles';
import { SvgThumbsUp } from './thumbsUp';
import { SvgThumbsDown } from './thumbsDown';

// type PropTypes = {}

function FeedbackWidget(/* { }: PropTypes */) {

  const [clicked, setClicked] = useState({ positive: false, negative: false });
  const positiveButtonCss = clicked.positive ? clickedCss : null;
  const negativeButtonCss = clicked.negative ? clickedCss : null;

  return (
    <aside css={wrapper}>
      <header css={header}>
        <h4>{clicked.negative ? 'What can we improve?' : 'Is this page helpful?'}</h4>
        <span>
          <ThemeProvider theme={buttonBrand}>
            <Button
              priority="subdued"
              size="default"
              hideLabel
              icon={<SvgThumbsUp />}
              cssOverrides={[positiveButtonCss, buttonStyles]}
              onClick={() => {
            sendTrackingEventsOnClick({
              id: 'landing_feedback_positive',
              product: 'DigitalPack',
              componentType: 'ACQUISITIONS_BUTTON',
            })();

            setClicked({ positive: true, negative: false });
          }}
            />
          </ThemeProvider>
          <ThemeProvider theme={buttonBrand}>
            <Button
              priority="subdued"
              size="default"
              hideLabel
              icon={<SvgThumbsDown />}
              cssOverrides={[negativeButtonCss, buttonStyles]}
              onClick={() => {
            sendTrackingEventsOnClick({
              id: 'landing_feedback_negative',
              product: 'DigitalPack',
              componentType: 'ACQUISITIONS_BUTTON',
            })();

            setClicked({ positive: false, negative: true });
          }}
            />
          </ThemeProvider>
        </span>
      </header>
      {clicked.negative && (
        <section css={feedbackLink}>
          <p>Please click the button to give us feedback so we can improve this page.</p>
          <LinkButton
            size="small"
            href=""
          >
            Take our survey
          </LinkButton>
        </section>
      )}
    </aside>
  );
}

export default FeedbackWidget;
