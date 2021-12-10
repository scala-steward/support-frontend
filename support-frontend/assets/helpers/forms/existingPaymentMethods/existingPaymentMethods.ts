// ----- Imports ----- //
import { fetchJson } from 'helpers/async/fetch';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { logException } from '../../utilities/logger';
import { getPaymentLabel } from '../checkouts';
import {
	DirectDebit,
	ExistingCard,
	ExistingDirectDebit,
	Stripe,
} from '../paymentMethods';
// ----- Types ----- //
export type ExistingPaymentMethodSubscription = {
	isActive: boolean;
	isCancelled: boolean;
	name: string;
};
type ExistingPaymentType = 'Card' | 'DirectDebit';
export type NotRecentlySignedInExistingPaymentMethod = {
	type: 'NotRecentlySignedIn';
	paymentType: ExistingPaymentType;
};
export type RecentlySignedInExistingPaymentMethod = {
	type: 'RecentlySignedIn';
	paymentType: ExistingPaymentType;
	billingAccountId: string;
	subscriptions: ExistingPaymentMethodSubscription[];
	card?: string;
	mandate?: string;
};
export type ExistingPaymentMethod =
	| NotRecentlySignedInExistingPaymentMethod
	| RecentlySignedInExistingPaymentMethod;

// ----- Functions ----- //
function isUsableExistingPaymentMethod(
	existingPaymentMethod: ExistingPaymentMethod,
): existingPaymentMethod is RecentlySignedInExistingPaymentMethod {
	return existingPaymentMethod.type == 'RecentlySignedIn';
}

function sendGetExistingPaymentMethodsRequest(
	isoCurrency: IsoCurrency,
	storeResponse: (arg0: ExistingPaymentMethod[]) => void,
): void {
	fetchJson(
		`${window.guardian.mdapiUrl}/user-attributes/me/existing-payment-options?currencyFilter=${isoCurrency}`,
		{
			mode: 'cors',
			credentials: 'include',
		},
	)
		.then((jsonResponse) => {
			if (Array.isArray(jsonResponse)) {
				storeResponse(jsonResponse);
			} else {
				throw new Error('existing payment options response was not an array');
			}
		})
		.catch((error) => {
			logException('Failed to get existing payment options', error);
			storeResponse([]);
		});
}

function mapExistingPaymentMethodToPaymentMethod(
	existingPaymentMethod: RecentlySignedInExistingPaymentMethod,
) {
	if (existingPaymentMethod.mandate) {
		return ExistingDirectDebit;
	}

	return ExistingCard;
}

function getExistingPaymentMethodLabel(
	existingPaymentMethod: RecentlySignedInExistingPaymentMethod,
): string {
	if (existingPaymentMethod.mandate) {
		const last3: string = existingPaymentMethod.mandate.slice(-3);
		return `${getPaymentLabel(DirectDebit)} (account ending ${last3})`;
	}

	if (existingPaymentMethod.card) {
		const last4: string = existingPaymentMethod.card;
		return `${getPaymentLabel(Stripe)} (ending ${last4})`;
	}

	return 'Other Payment Method';
}

function subscriptionToExplainerPart(
	subscription: ExistingPaymentMethodSubscription,
) {
	const activeOrRecentPrefix = subscription.isActive ? 'current' : 'recent';
	return `${
		subscription.isCancelled ? 'recently cancelled' : activeOrRecentPrefix
	} ${subscription.name}`;
}

function subscriptionsToExplainerList(subscriptionParts: string[]) {
	return subscriptionParts
		.slice(0, -1)
		.join(', ')
		.concat(
			subscriptionParts.length > 1 ? ' and ' : '',
			subscriptionParts.slice(-1)[0],
		);
}

export {
	sendGetExistingPaymentMethodsRequest,
	isUsableExistingPaymentMethod,
	mapExistingPaymentMethodToPaymentMethod,
	getExistingPaymentMethodLabel,
	subscriptionToExplainerPart,
	subscriptionsToExplainerList,
};
