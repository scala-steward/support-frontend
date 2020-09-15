// @flow

// ----- Imports ----- //

import * as React from 'react';
import { connect } from 'react-redux';
import { css } from '@emotion/core';
import { textSans, headline } from '@guardian/src-foundations/typography';
import { text, sport, neutral } from '@guardian/src-foundations/palette';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { LinkButton } from '@guardian/src-button';

import { SvgCheckmark } from '@guardian/src-icons';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import CheckoutLayout, { Content } from 'components/subscriptionCheckouts/layout';
import OrderSummaryThankYou from 'pages/digital-subscription-checkout/components/orderSummary/orderSummaryThankYou';
import GridImage from 'components/gridImage/gridImage';
import { PageSection } from 'pages/digital-subscription-checkout/components/thankYou/pageSection';
import clock from 'pages/digital-subscription-checkout/components/thankYou/icons/clock.png';
import list from 'pages/digital-subscription-checkout/components/thankYou/icons/list.png';
import gift from 'pages/digital-subscription-checkout/components/thankYou/icons/gift.png';
import person from 'pages/digital-subscription-checkout/components/thankYou/icons/person.png';
import phone from 'pages/digital-subscription-checkout/components/thankYou/icons/phone.png';
import { formatUserDate } from 'helpers/dateConversions';


// ----- Styles ----- //

const greenCircle = css`
  display: inline-block;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: ${text.success};
  margin-right: ${space[2]}px;
  svg {
    fill: white;
  }
`;

const pageHeading = css`
  display: inline-block;
  ${headline.xsmall({ fontWeight: 'bold' })};
  color: ${text.ctaSecondary};
  margin-bottom: ${space[2]}px;
`;

const blueSans = css`
  ${textSans.medium()};
  color: ${text.ctaSecondary};
`;

const subHeading = css`
  ${headline.xsmall({ fontWeight: 'bold' })};
  margin-bottom: ${space[3]}px;
`;

const minorHeading = css`
  ${headline.xxsmall({ fontWeight: 'bold' })};
  margin-bottom: ${space[3]}px;
`;

const detailsWithIcon = css`
  display: inline-flex;
  margin-bottom: ${space[5]}px;
  :last-of-type {
    margin-bottom: 0;
  }
`;

const detailsWithIconList = css`
  display: flex;
  margin-bottom: ${space[3]}px;
  :last-of-type {
    margin-bottom: 0;
  }

  ${from.leftCol} {
    margin-bottom: 0;
  }
`;

const iconContainer = css`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50px;
  background-color: ${sport[800]};
  margin-right: ${space[3]}px;
  img {
    display: block;
  }
`;

const summaryDetails = css`
  display: inline-flex;
  flex-direction: column;
  max-width: 85%;
`;

const detailsGrey = css`
  ${textSans.medium({ fontWeight: 'bold' })};
  color: ${neutral[46]};
`;

const sansText = css`
  ${textSans.medium()};
`;

const giftStep = css`
  ${textSans.medium()};
  max-width: 85%;
`;

const blueLineContainer = css`
  display: none;
  ${from.leftCol} {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -10px;
    width: 38px;
    height: 38px;
  }
`;

const blueLinkLine = css`
  height: 25px;
  width: 0;
  border-left: 2px solid ${text.ctaSecondary};
  margin-left: -2px;
`;

// ----- Types ----- //

export type PropTypes = {
  giftDeliveryDate: string,
  giftRecipient: string,
  marketingConsent: React.Node,
};

// ----- Map state to props ----- //

function mapStateToProps(state: CheckoutState) {
  return {
    giftDeliveryDate: state.page.checkout.giftStartDate,
    giftRecipient: state.page.checkout.firstNameGiftRecipient,
  };
}

const GreenCheckMark = () => (
  <div css={greenCircle}>
    <SvgCheckmark />
  </div>
);


function ThankYouGift(props: PropTypes) {
  const dateArray = props.giftDeliveryDate ? props.giftDeliveryDate.split('/') : [];
  const date = dateArray.length && new Date(`${dateArray[1]} ${dateArray[0]} ${dateArray[2]}`);
  const fullDate = formatUserDate(new Date(date));

  return (
    <div className="thank-you-stage">
      <Content>
        <CheckoutLayout aside={(
          <OrderSummaryThankYou
            image={
              <GridImage
                gridId="subscriptionDailyPackshot"
                srcSizes={[1000, 500]}
                sizes="(max-width: 740px) 50vw, 500"
                imgType="png"
                altText=""
              />
                }
            title="Digital Gift Subscription"
          />)}
        >
          <PageSection>
            <GreenCheckMark /><h1 css={pageHeading}>Thank you for your order</h1>
            <div css={blueSans}>Your Digital subscription order has been placed successfully</div>
          </PageSection>
          <PageSection>
            <h2 css={subHeading}>Order Summary</h2>
            <div css={detailsWithIcon}>
              <div css={iconContainer}><img src={clock} alt="" /></div>
              <div css={summaryDetails}>
                <div css={detailsGrey}>Gift delivery date</div>
                <div css={sansText}>{fullDate}</div>
              </div>
            </div>
            <div css={detailsWithIcon}>
              <div css={iconContainer}><img src={list} alt="" /></div>
              <div css={summaryDetails}>
                <div css={detailsGrey}>What&apos;s included?</div>
                <div css={sansText}>The Guardian Editions app, Premium access to The Guardian Live app and ad-free
                reading on theguardian.com
                </div>
              </div>
            </div>
          </PageSection>
          <PageSection>
            <h2 css={subHeading}>Next steps</h2>
            <ul>
              <li css={detailsWithIconList}>
                <div css={iconContainer}><img src={gift} alt="" /></div>
                <div css={giftStep}>{props.giftRecipient} will receive an email on the date you&apos;ve chosen with
                the link to redeem the gift.
                </div>
              </li>
              <li>
                <div css={blueLineContainer}><div css={blueLinkLine} /></div>
              </li>
              <li css={detailsWithIconList}>
                <div css={iconContainer}><img src={person} alt="" /></div>
                <div css={giftStep}>After redemption, {props.giftRecipient} will have to register or sign into their
                account and the subscription will be activated.
                </div>
              </li>
              <li>
                <div css={blueLineContainer}><div css={blueLinkLine} /></div>
              </li>
              <li css={detailsWithIconList}>
                <div css={iconContainer}><img src={phone} alt="" /></div>
                <div css={giftStep}>{props.giftRecipient} will download the smartphone and tablet apps and can sign
                in on the web to enjoy all the benefits of being a subscriber.
                </div>
              </li>
            </ul>
          </PageSection>
          <PageSection>
            <h3 css={minorHeading}>Tell us about your subscription</h3>
            <LinkButton
              href="https://www.surveymonkey.co.uk/r/QF9ZGQR"
              priority="secondary"
              aria-label="Link to subscription survey"
            >
            Share your thoughts
            </LinkButton>
          </PageSection>
          <PageSection>
            {props.marketingConsent}
            <div css={sansText}>This is the option to choose if you want to hear about how to make the most of your
            digital subscription, receive a dedicated weekly email from our membership editor and get more information
            on ways to support The Guardian.
            </div>
          </PageSection>
        </CheckoutLayout>
      </Content>
    </div>
  );

}

// ----- Export ----- //


export default connect(mapStateToProps)(ThankYouGift);
