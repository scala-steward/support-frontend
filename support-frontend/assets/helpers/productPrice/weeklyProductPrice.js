// @flow

import {
  countryGroups,
  fromCountry,
  GBPCountries,
} from 'helpers/internationalisation/countryGroup';
import type { WeeklyBillingPeriod } from 'helpers/billingPeriods';
<<<<<<< HEAD
import { Annual, Quarterly, SixForSix } from 'helpers/billingPeriods';
import { getPromotionWeeklyProductPrice, getWeeklyProductPrice } from 'helpers/subscriptions';
import type { Price } from 'helpers/productPrice/productPrices';


export const getPrice = (countryGroupId: CountryGroupId, period: WeeklyBillingPeriod) => [
  currencies[detect(countryGroupId)].extendedGlyph,
  getWeeklyProductPrice(countryGroupId, period),
].join('');

export const getCurrencyAndPrice = (countryGroupId: CountryGroupId, period: WeeklyBillingPeriod): Price => (
  {
    currency: detect(countryGroupId),
    price: parseFloat(getWeeklyProductPrice(countryGroupId, period)),
  }
);

export const getPromotionPrice = (countryGroupId: CountryGroupId, period: WeeklyBillingPeriod, promoCode: string) => [
  currencies[detect(countryGroupId)].extendedGlyph,
  getPromotionWeeklyProductPrice(countryGroupId, period, promoCode),
].join('');
=======
import { Annual, Quarterly, SixWeekly } from 'helpers/billingPeriods';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { displayPrice } from 'helpers/productPrice/productPrices';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { Domestic, RestOfWorld } from 'helpers/productPrice/fulfilmentOptions';
import { getPromotionWeeklyProductPrice } from 'helpers/subscriptions';
import { currencies, detect } from 'helpers/internationalisation/currency';

const getPromotionPrice = (country: IsoCountry, period: WeeklyBillingPeriod, promoCode: string) => {
  const countryGroupId = fromCountry(country) || GBPCountries;
  return [
    currencies[detect(countryGroupId)].extendedGlyph,
    getPromotionWeeklyProductPrice(countryGroupId, period, promoCode),
  ].join('');
};

const getFulfilmentOption = (country: IsoCountry) =>
  (countryGroups.International.countries.includes(country) ? RestOfWorld : Domestic);
>>>>>>> Use Zuora prices in the weekly checkout

const displayBillingPeriods = {
  [SixWeekly]: {
    title: '6 for 6',
    offer: 'Introductory offer',
    copy: (country: IsoCountry, productPrices: ProductPrices) =>
      `${displayPrice(productPrices, country, SixWeekly, getFulfilmentOption(country))} for the first 6 issues (then 
      ${displayPrice(productPrices, country, Quarterly, getFulfilmentOption(country))} quarterly)`,
  },
  [Quarterly]: {
    title: 'Quarterly',
    copy: (country: IsoCountry, productPrices: ProductPrices) =>
      `${displayPrice(productPrices, country, Quarterly, getFulfilmentOption(country))} every 3 months`,
  },
  [Annual]: {
    title: 'Annually',
    offer: 'Save 10%',
    copy: (country: IsoCountry, productPrices: ProductPrices) =>
      `${getPromotionPrice(country, 'Annual', '10ANNUAL')} for 1 year, then standard rate (
      ${displayPrice(productPrices, country, Annual, getFulfilmentOption(country))} every year)`,
  },
};

export { getFulfilmentOption, displayBillingPeriods };
