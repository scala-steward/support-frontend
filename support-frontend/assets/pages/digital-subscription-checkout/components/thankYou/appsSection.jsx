// @flow

// ----- Imports ----- //

import React from 'react';
import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';

import { ThemeProvider } from 'emotion-theming';
import { LinkButton, buttonReaderRevenueBrandAlt } from '@guardian/src-button';
import { SvgArrowRightStraight } from '@guardian/src-icons';

import {
  getIosAppUrl,
  androidAppUrl,
  androidDailyUrl,
  getDailyEditionUrl,
} from 'helpers/urls/externalLinks';


import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';

import Text from 'components/text/text';
import { SvgEditionsIcon, SvgLiveAppIcon } from 'components/icons/appsIcon';

// ----- Types ----- //

type PropTypes = {
  countryGroupId: CountryGroupId,
};

const ctas = css`
  display: inline-flex;
  flex-direction: column;
`;

const smallFormatText = css`
  display: inline-block;
  ${from.desktop} {
    display: none;
  }
`;

const largerFormatText = css`
  display: none;
  ${from.desktop} {
    display: inline-block;
  }
`;

const marginForFirstButton = css`
  margin-bottom: ${space[3]}px;
`;

const marginTop = css`
  margin-top: ${space[9]}px;
`;


// ----- Component ----- //

const AppsSection = ({ countryGroupId }: PropTypes) => (
  <div>
    <div css={marginTop}><SvgEditionsIcon /></div>
    <Text title="Download The Guardian Editions app" headingSize={3}>
      <p>Each day&#39;s edition, in one simple, elegant app. Contains the UK Daily, Australia Weekend
        and other special editions.
      </p>
      <div css={ctas}>
        <ThemeProvider theme={buttonReaderRevenueBrandAlt}>
          <LinkButton
            css={marginForFirstButton}
            priority="tertiary"
            size="default"
            icon={<SvgArrowRightStraight />}
            iconSide="right"
            nudgeIcon
            aria-label="Click to download the Guardian Daily app on the Apple App Store"
            href={getDailyEditionUrl(countryGroupId)}
            onClick={sendTrackingEventsOnClick({
              id: 'checkout_thankyou_daily_edition_apple',
              product: 'DigitalPack',
              componentType: 'ACQUISITIONS_BUTTON',
            })}
          >
            <span css={largerFormatText}>The Guardian Editions app for iOS</span>
            <span css={smallFormatText}>Editions app for iOS</span>
          </LinkButton>
          <LinkButton
            priority="tertiary"
            size="default"
            icon={<SvgArrowRightStraight />}
            iconSide="right"
            nudgeIcon
            aria-label="Click to download the Guardian Daily app on Google Play"
            href={androidDailyUrl}
            onClick={sendTrackingEventsOnClick({
              id: 'checkout_thankyou_daily_edition_android',
              product: 'DigitalPack',
              componentType: 'ACQUISITIONS_BUTTON',
            })}
          >
            <span css={largerFormatText}>The Guardian Editions app for Android</span>
            <span css={smallFormatText}>Editions app for Android</span>
          </LinkButton>
        </ThemeProvider>
      </div>
    </Text>
    <div css={marginTop}><SvgLiveAppIcon /></div>
    <Text title="Download The Guardian Live app" headingSize={3}>
      <p>
        With premium access to The Guardian Live app get breaking news, as it happens.
      </p>
      <div css={ctas}>
        <ThemeProvider theme={buttonReaderRevenueBrandAlt}>
          <LinkButton
            css={marginForFirstButton}
            priority="tertiary"
            size="default"
            icon={<SvgArrowRightStraight />}
            iconSide="right"
            nudgeIcon
            aria-label="Click to download the app on the Apple App Store"
            href={getIosAppUrl(countryGroupId)}
            onClick={sendTrackingEventsOnClick({
              id: 'checkout_thankyou_live_app_apple',
              product: 'DigitalPack',
              componentType: 'ACQUISITIONS_BUTTON',
            })}
          >
            <span css={largerFormatText}>The Guardian Live app for iOS</span>
            <span css={smallFormatText}>Live app for iOS</span>
          </LinkButton>
          <LinkButton
            priority="tertiary"
            size="default"
            icon={<SvgArrowRightStraight />}
            iconSide="right"
            nudgeIcon
            aria-label="Click to download the app on the Google Play store"
            href={androidAppUrl}
            onClick={sendTrackingEventsOnClick({
              id: 'checkout_thankyou_live_app_android',
              product: 'DigitalPack',
              componentType: 'ACQUISITIONS_BUTTON',
            })}
          >
            <span css={largerFormatText}>The Guardian Live app for Android</span>
            <span css={smallFormatText}>Live app for Android</span>
          </LinkButton>
        </ThemeProvider>
      </div>
    </Text>
    <div css={marginTop} />
    <Text title="Sign into theguardian.com">
      <p>
        Never be interrupted or distracted by ads again by signing in. Just use your subscriber email
        and password when you next visit.
      </p>
      <ThemeProvider theme={buttonReaderRevenueBrandAlt}>
        <LinkButton
          css={marginForFirstButton}
          priority="tertiary"
          size="default"
          icon={<SvgArrowRightStraight />}
          iconSide="right"
          nudgeIcon
          aria-label="Click to sign in to the website"
          href="https://www.theguardian.com/"
          onClick={sendTrackingEventsOnClick({
            id: 'checkout_thankyou_sign_in',
            product: 'DigitalPack',
            componentType: 'ACQUISITIONS_BUTTON',
          })}
        >
          <span css={largerFormatText}>Sign into the website</span>
          <span css={smallFormatText}>Sign in</span>
        </LinkButton>
      </ThemeProvider>
    </Text>
  </div>
);


// ----- Export ----- //

export default AppsSection;
