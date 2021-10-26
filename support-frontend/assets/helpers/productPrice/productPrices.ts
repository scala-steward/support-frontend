import type { IsoCountry } from 'helpers/internationalisation/country';
import type {
	CountryGroup,
	CountryGroupName,
} from 'helpers/internationalisation/countryGroup';
import {
	countryGroups,
	fromCountry,
	GBPCountries,
} from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { extendedGlyph, glyph } from 'helpers/internationalisation/currency';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { NoFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import type { Promotion } from 'helpers/productPrice/promotions';
import { applyDiscount, getPromotion } from 'helpers/productPrice/promotions';
import { fixDecimals } from 'helpers/productPrice/subscriptions';
// ----- Types ----- //
export type ProductPrice = {
	price: number;
	savingVsRetail?: number;
	currency: IsoCurrency;
	fixedTerm: boolean;
	promotions?: Promotion[];
};
export type CountryGroupPrices = Record<
	FulfilmentOptions,
	Record<
		ProductOptions,
		Record<BillingPeriod, Record<IsoCurrency, ProductPrice>>
	>
>;
export type ProductPrices = Record<CountryGroupName, CountryGroupPrices>;
export type BillingPeriods = Record<
	BillingPeriod,
	Record<IsoCurrency, ProductPrice>
>;

const isNumeric = (num: number | null | undefined): boolean =>
	num !== null && num !== undefined && !Number.isNaN(num);

function getFirstValidPrice(...prices: Array<number | null | undefined>) {
	return prices.find(isNumeric) ?? 0;
}

function getCountryGroup(country: IsoCountry): CountryGroup {
	return countryGroups[fromCountry(country) ?? GBPCountries];
}

function getProductPrice(
	productPrices: ProductPrices,
	country: IsoCountry,
	billingPeriod: BillingPeriod,
	fulfilmentOption: FulfilmentOptions = NoFulfilmentOptions,
	productOption: ProductOptions = NoProductOptions,
): ProductPrice {
	const countryGroup = getCountryGroup(country);
	return productPrices[countryGroup.name][fulfilmentOption][productOption][
		billingPeriod
	][countryGroup.currency];
}

function finalPrice(
	productPrices: ProductPrices,
	country: IsoCountry,
	billingPeriod: BillingPeriod,
	fulfilmentOption: FulfilmentOptions = NoFulfilmentOptions,
	productOption: ProductOptions = NoProductOptions,
): ProductPrice {
	return applyDiscount(
		getProductPrice(
			productPrices,
			country,
			billingPeriod,
			fulfilmentOption,
			productOption,
		),
		getPromotion(
			productPrices,
			country,
			billingPeriod,
			fulfilmentOption,
			productOption,
		),
	);
}

const showPrice = (p: ProductPrice, isExtended = true): string => {
	const showGlyph = isExtended ? extendedGlyph : glyph;
	return `${showGlyph(p.currency)}${fixDecimals(p.price)}`;
};

const displayPrice = (
	productPrices: ProductPrices,
	country: IsoCountry,
	billingPeriod: BillingPeriod,
	fulfilmentOption: FulfilmentOptions = NoFulfilmentOptions,
	productOption: ProductOptions = NoProductOptions,
) =>
	showPrice(
		getProductPrice(
			productPrices,
			country,
			billingPeriod,
			fulfilmentOption,
			productOption,
		),
	);

function getCurrency(country: IsoCountry): IsoCurrency {
	const { currency } = getCountryGroup(country);
	return currency;
}

export {
	getProductPrice,
	getFirstValidPrice,
	finalPrice,
	getCurrency,
	getCountryGroup,
	showPrice,
	displayPrice,
	isNumeric,
};
