import { SansParagraph } from 'components/text/text';
import type { CountryGroupName } from 'helpers/internationalisation/countryGroup';
import {
	fromCountryGroupName,
	International,
} from 'helpers/internationalisation/countryGroup';
import { extendedGlyph } from 'helpers/internationalisation/currency';
import {
	Annual,
	postIntroductorySixForSixBillingPeriod,
} from 'helpers/productPrice/billingPeriods';
import { Domestic, RestOfWorld } from 'helpers/productPrice/fulfilmentOptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import type { CountryGroupPrices } from 'helpers/productPrice/productPrices';
import { showPrice } from 'helpers/productPrice/productPrices';
import type { PromotionTermsPropTypes } from 'pages/promotion-terms/promotionTermsReducer';

type NameAndSaving = {
	name: CountryGroupName;
	saving: string | null | undefined;
};
const orderedCountryGroupNames: NameAndSaving[] = [
	{
		name: 'United Kingdom',
		saving: '34%',
	},
	{
		name: 'United States',
		saving: '34%',
	},
	{
		name: 'Australia',
		saving: '30%',
	},
	{
		name: 'Europe',
		saving: '30%',
	},
	{
		name: 'New Zealand',
		saving: '19%',
	},
	{
		name: 'Canada',
		saving: '30%',
	},
	{
		name: 'International',
		saving: null,
	},
];
const shortTermDescription = 'Monthly (4 weeks)';
export default function WeeklyTerms(
	props: PromotionTermsPropTypes,
): JSX.Element {
	const includes6For6 =
		props.promotionTerms.productRatePlans.filter((ratePlan) =>
			ratePlan.includes('6 for 6'),
		).length > 0;

	if (includes6For6) {
		return <SixForSix {...props} />;
	}

	return <StandardTerms {...props} />;
}

function getCountryPrice(
	countryGroupName: CountryGroupName,
	prices: CountryGroupPrices,
) {
	const { currency } = fromCountryGroupName(countryGroupName);
	const currencyGlyph = extendedGlyph(currency);
	const fulfilmentOption =
		countryGroupName === International ? RestOfWorld : Domestic;
	const shortTermPrice =
		prices[fulfilmentOption]?.[NoProductOptions]?.[
			postIntroductorySixForSixBillingPeriod
		]?.[currency];
	const annualPrice =
		prices[fulfilmentOption]?.[NoProductOptions]?.[Annual]?.[currency];
	return {
		currencyGlyph,
		shortTermPrice,
		annualPrice,
	};
}

function getSaving(saving: string | null | undefined) {
	if (saving) {
		return `, saving ${saving} off the cover price.`;
	}

	return '.';
}

function StandardCountryPrice(
	nameAndSaving: NameAndSaving,
	prices: CountryGroupPrices,
) {
	const { shortTermPrice, annualPrice } = getCountryPrice(
		nameAndSaving.name,
		prices,
	);
	return shortTermPrice && annualPrice ? (
		<SansParagraph>
			<strong>{nameAndSaving.name}:</strong> {shortTermDescription} subscription
			rate {showPrice(shortTermPrice)}, or annual rate {showPrice(annualPrice)}
			{getSaving(nameAndSaving.saving)}
		</SansParagraph>
	) : null;
}

function SixForSixCountryPrice(
	nameAndSaving: NameAndSaving,
	prices: CountryGroupPrices,
) {
	const { currencyGlyph, shortTermPrice } = getCountryPrice(
		nameAndSaving.name,
		prices,
	);
	return currencyGlyph && shortTermPrice ? (
		<SansParagraph>
			<strong>{nameAndSaving.name}:</strong> Offer is {currencyGlyph}6 for the
			first 6 issues followed by {shortTermDescription.toLowerCase()}
			subscription payments of {showPrice(shortTermPrice)} thereafter
			{getSaving(nameAndSaving.saving)}
		</SansParagraph>
	) : null;
}

function StandardTerms(props: PromotionTermsPropTypes) {
	return (
		<div>
			<SansParagraph>
				Offer subject to availability. Guardian News and Media Limited
				(&quot;GNM&quot;) reserves the right to withdraw this promotion at any
				time.
			</SansParagraph>
			<SansParagraph>
				You must be 18+ to be eligible for a Guardian Weekly subscription.
			</SansParagraph>
			{orderedCountryGroupNames.map((nameAndSaving) => {
				const countryGroupPrices = props.productPrices[nameAndSaving.name];

				return countryGroupPrices
					? StandardCountryPrice(nameAndSaving, countryGroupPrices)
					: null;
			})}
		</div>
	);
}

function SixForSix(props: PromotionTermsPropTypes) {
	return (
		<div>
			<SansParagraph>
				Offer subject to availability. Guardian News and Media Limited
				(&quot;GNM&quot;) reserves the right to withdraw this promotion at any
				time.
			</SansParagraph>
			<SansParagraph>
				Offer not available to current subscribers of Guardian Weekly. You must
				be 18+ to be eligible for this offer. Guardian Weekly reserve the right
				to end this offer at any time.
			</SansParagraph>
			{orderedCountryGroupNames.map((nameAndSaving) => {
				const countryGroupPrices = props.productPrices[nameAndSaving.name];

				return countryGroupPrices
					? SixForSixCountryPrice(nameAndSaving, countryGroupPrices)
					: null;
			})}
		</div>
	);
}
