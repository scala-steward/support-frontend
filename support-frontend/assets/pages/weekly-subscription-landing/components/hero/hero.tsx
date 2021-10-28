// ----- Imports ----- //
import { css } from '@emotion/core';
import { buttonBrand, LinkButton } from '@guardian/src-button';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { body, headline } from '@guardian/src-foundations/typography';
import { SvgArrowDownStraight } from '@guardian/src-icons';
import { ThemeProvider } from 'emotion-theming';
import React from 'react';
import GiftHeadingAnimation from 'components/animations/giftHeadingAnimation';
import CentredContainer from 'components/containers/centredContainer';
import GridImage from 'components/gridImage/gridImage';
import Hero from 'components/page/hero';
import PageTitle from 'components/page/pageTitle';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	detect,
	GBPCountries,
} from 'helpers/internationalisation/countryGroup';
import {
	fromCountryGroupId,
	glyph,
} from 'helpers/internationalisation/currency';
import { promotionHTML } from 'helpers/productPrice/promotions';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import type { Participations } from 'helpers/abTests/abtest';

type PropTypes = {
	orderIsAGift: boolean;
	countryGroupId: CountryGroupId;
	promotionCopy: PromotionCopy;
	participations: Participations;
};
const weeklyHeroCopy = css`
	padding: 0 ${space[3]}px ${space[3]}px;
`;
const weeklyHeroTitle = css`
	${headline.small({
		fontWeight: 'bold',
	})};
	margin-bottom: ${space[3]}px;

	${from.mobileLandscape} {
		width: 75%;
	}

	${from.tablet} {
		${headline.large({
			fontWeight: 'bold',
		})};
		width: 100%;
	}
`;
const weeklyHeroParagraph = css`
	${body.medium({
		lineHeight: 'loose',
	})}
	margin-bottom: ${space[9]}px;

	/* apply the same margin to paragraphs parsed from markdown from promo codes */
	& p:not(:last-of-type) {
		margin-bottom: ${space[9]}px;
	}
`;
const roundelCentreLine = css`
	${headline.xxsmall({
		fontWeight: 'bold',
	})}

	${from.tablet} {
		${headline.medium({
			fontWeight: 'bold',
		})}
	}

	${from.tablet} {
		${headline.large({
			fontWeight: 'bold',
		})}
	}
`;
const giftHeroSubHeading = css`
	font-weight: 700;
`;
const showOnMobile = css`
	display: block;

	${from.mobileLandscape} {
		display: none;
	}
`;

const getRegionalCopyFor = (region: CountryGroupId) =>
	region === GBPCountries ? (
		<span>
			Find clarity
			<br css={showOnMobile} /> with the Guardian&apos;s global magazine
		</span>
	) : (
		<span>
			Read The
			<br css={showOnMobile} /> Guardian in print
		</span>
	);

const getFirstParagraph = (
	promotionCopy: PromotionCopy,
	orderIsAGift: boolean,
) => {
	if (promotionCopy.description) {
		return promotionHTML(promotionCopy.description);
	}

	if (orderIsAGift) {
		return (
			<>
				<h3 css={giftHeroSubHeading}>
					Stay on the same page, even when you’re apart
				</h3>
				<p>
					Share the gift of clarity with the Guardian Weekly magazine. A
					round-up of the world news, opinion and long reads that have shaped
					the week, all handpicked from the Guardian and the Observer.
				</p>
			</>
		);
	}

	return (
		<>
			The Guardian Weekly magazine is a round-up of the world news, opinion and
			long reads that have shaped the week. Inside, the past seven days' most
			memorable stories are reframed with striking photography and insightful
			companion pieces, all handpicked from the Guardian and the Observer.
		</>
	);
};

function WeeklyHero({
	orderIsAGift,
	countryGroupId,
	promotionCopy,
	participations,
}: PropTypes) {
	const currencyId = fromCountryGroupId(countryGroupId) ?? 'GBP';

	let defaultRoundelText;
	if (participations.sixForSixSuppression === 'variant') {

		defaultRoundelText = (
			<>
				<div role="text">
					Save<br/>
					up to 34%<br/>
					a year
				</div>
			</>
		);
	}
	else {
		defaultRoundelText = (
			<>
				{
					// role="text" is non-standardised but works in Safari. Ensures the whole section is read as one text element
				}
				<div role="text">
					Try
					<div css={roundelCentreLine}>6 issues</div>
					for {glyph(currencyId)}6
				</div>
			</>
		);
	}

	const defaultTitle = orderIsAGift ? null : getRegionalCopyFor(detect());
	const title = promotionCopy.title ?? defaultTitle;
	const copy = getFirstParagraph(promotionCopy, orderIsAGift);
	const roundelText =
		promotionHTML(promotionCopy.roundel) ?? defaultRoundelText;

	return (
		<PageTitle
			title={orderIsAGift ? 'Give the Guardian Weekly' : 'The Guardian Weekly'}
			theme="weekly"
		>
			<CentredContainer>
				<Hero
					image={
						<GridImage
							gridId="weeklyCampaignHeroImg"
							srcSizes={[1000, 500, 140]}
							sizes="(max-width: 740px) 100%,
            (max-width: 1067px) 150%,
            500px"
							imgType="png"
							altText="A collection of Guardian Weekly magazines"
						/>
					}
					roundelText={orderIsAGift ? null : roundelText}
				>
					<section css={weeklyHeroCopy}>
						{orderIsAGift ? (
							<GiftHeadingAnimation />
						) : (
							<h2 css={weeklyHeroTitle}>{title}</h2>
						)}
						<p css={weeklyHeroParagraph}>{copy}</p>
						<ThemeProvider theme={buttonBrand}>
							<LinkButton
								onClick={sendTrackingEventsOnClick({
									id: 'options_cta_click',
									product: 'GuardianWeekly',
									componentType: 'ACQUISITIONS_BUTTON',
								})}
								priority="tertiary"
								iconSide="right"
								icon={<SvgArrowDownStraight />}
								href="#subscribe"
							>
								See pricing options
							</LinkButton>
						</ThemeProvider>
					</section>
				</Hero>
			</CentredContainer>
		</PageTitle>
	);
}

export { WeeklyHero };
