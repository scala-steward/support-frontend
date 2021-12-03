import type { ContributionType } from 'helpers/contributions';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { Stripe } from 'helpers/forms/paymentMethods';
import type { IsoCountry } from 'helpers/internationalisation/country';

const stripeCardFormIsIncomplete = (
	paymentMethod: PaymentMethod,
	stripeCardFormComplete: boolean,
): boolean => paymentMethod === Stripe && !stripeCardFormComplete;

export type StripeAccount = 'ONE_OFF' | 'REGULAR';

export type StripeKeysForLocale = {
	[key in StripeAccount]: {
		uat: string;
		default: string;
	};
};

const stripeAccountForContributionType: Record<
	ContributionType,
	StripeAccount
> = {
	ONE_OFF: 'ONE_OFF',
	MONTHLY: 'REGULAR',
	ANNUAL: 'REGULAR',
};

export interface StripeKey {
	ONE_OFF: {
		uat: string;
		default: string;
	};
	REGULAR: {
		uat: string;
		default: string;
	};
}

function getStripeKey(
	stripeAccount: StripeAccount,
	country: IsoCountry,
	isTestUser: boolean,
): string {
	switch (country) {
		case 'AU':
			return isTestUser
				? window.guardian.stripeKeyAustralia[stripeAccount].uat
				: window.guardian.stripeKeyAustralia[stripeAccount].default;

		case 'US':
			return isTestUser
				? window.guardian.stripeKeyUnitedStates[stripeAccount].uat
				: window.guardian.stripeKeyUnitedStates[stripeAccount].default;

		default:
			return isTestUser
				? window.guardian.stripeKeyDefaultCurrencies[stripeAccount].uat
				: window.guardian.stripeKeyDefaultCurrencies[stripeAccount].default;
	}
}

export {
	stripeCardFormIsIncomplete,
	stripeAccountForContributionType,
	getStripeKey,
};
