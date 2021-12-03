import type { Stripe } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';
import { useEffect, useState } from 'react';
import type { StripeAccount } from 'helpers/forms/stripe';

//  this is required as useStripeObjects is used in multiple components
//  but we only want to call setLoadParameters once.
const stripeScriptHasBeenAddedToPage = (): boolean =>
	!!document.querySelector("script[src^='https://js.stripe.com']");

interface StripeObjects {
	ONE_OFF: Stripe | null;
	REGULAR: Stripe | null;
}

export const useStripeObjects = (
	stripeAccount: StripeAccount,
	stripeKey: string,
): StripeObjects => {
	const [stripeObjects, setStripeObjects] = useState<StripeObjects>({
		REGULAR: null,
		ONE_OFF: null,
	});

	useEffect(() => {
		if (stripeObjects[stripeAccount] === null) {
			if (!stripeScriptHasBeenAddedToPage()) {
				loadStripe.setLoadParameters({
					advancedFraudSignals: false,
				});
			}

			void loadStripe(stripeKey).then((newStripe) => {
				setStripeObjects((prevData) => ({
					...prevData,
					[stripeAccount]: newStripe,
				}));
			});
		}
	}, [stripeAccount]);
	return stripeObjects;
};
