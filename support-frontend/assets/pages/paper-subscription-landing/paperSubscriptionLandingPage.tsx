// ----- Imports ----- //
// @ts-expect-error
import React, { useState } from 'react';
import CentredContainer from 'components/containers/centredContainer';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import Footer from 'components/footerCompliant/Footer';
import Header from 'components/headers/header/header';
import Block from 'components/page/block';
import Page from 'components/page/page';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { getPromotionCopy } from 'helpers/productPrice/promotions';
import { renderPage } from 'helpers/rendering/render';
import 'stylesheets/skeleton/skeleton.scss';
import './paperSubscriptionLanding.scss';
import { paperSubsUrl } from 'helpers/urls/routes';
import PaperHero from './components/hero/hero';
import Prices from './components/paperPrices';
import Tabs from './components/tabs';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import {
	Collection,
	HomeDelivery,
} from 'helpers/productPrice/fulfilmentOptions';
import type { PaperLandingPropTypes } from './paperSubscriptionLandingProps';
import { paperLandingProps } from './paperSubscriptionLandingProps';
import { tabsTabletSpacing } from './paperSubscriptionLandingStyles';
// ----- Collection or delivery ----- //
const reactElementId = 'paper-subscription-landing-page';
// ----- Redux Store ----- //
const paperSubsFooter = (
	<Footer termsConditionsLink="https://www.theguardian.com/subscriber-direct/subscription-terms-and-conditions" />
);
// ----- Render ----- //
// ID for Selenium tests
const pageQaId = 'qa-paper-subscriptions';

function PaperLandingPage({
	productPrices,
	promotionCopy,
}: PaperLandingPropTypes) {
	const sanitisedPromoCopy = getPromotionCopy(promotionCopy);
	const fulfilment: PaperFulfilmentOptions = window.location.pathname.includes(
		'delivery',
	)
		? HomeDelivery
		: Collection;
	const [selectedTab, setSelectedTab] =
		useState<PaperFulfilmentOptions>(fulfilment);

	if (!productPrices) {
		return null;
	}

	function handleSetTabAction(newTab: PaperFulfilmentOptions) {
		setSelectedTab(newTab);
		sendTrackingEventsOnClick({
			id: `Paper_${newTab}-tab`,
			// eg. Paper_Collection-tab or Paper_HomeDelivery-tab
			product: 'Paper',
			componentType: 'ACQUISITIONS_BUTTON',
		})();
		window.history.replaceState(
			{},
			null,
			paperSubsUrl(newTab === HomeDelivery),
		);
	}

	return (
		<Page
			id={pageQaId}
			header={<Header countryGroupId={GBPCountries} />}
			footer={paperSubsFooter}
		>
			<PaperHero
				productPrices={productPrices}
				promotionCopy={sanitisedPromoCopy}
			/>
			<FullWidthContainer>
				<CentredContainer>
					<Block>
						<div css={tabsTabletSpacing}>
							<Tabs
								selectedTab={selectedTab}
								setTabAction={handleSetTabAction}
							/>
						</div>
					</Block>
				</CentredContainer>
			</FullWidthContainer>
			<FullWidthContainer theme="dark" hasOverlap>
				<CentredContainer>
					<Prices
						productPrices={productPrices}
						tab={selectedTab}
						setTabAction={setSelectedTab}
					/>
				</CentredContainer>
			</FullWidthContainer>
		</Page>
	);
}

setUpTrackingAndConsents();
const content = <PaperLandingPage {...paperLandingProps()} />;
renderPage(content, reactElementId);
export { content };
