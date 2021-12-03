// ----- Imports ----- //
import { Elements } from '@stripe/react-stripe-js';
import * as React from 'react';
import AnimatedDots from 'components/spinners/animatedDots';
import type { ContributionType } from 'helpers/contributions';
import { useStripeObjects } from 'helpers/customHooks/useStripeObjects';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { Stripe } from 'helpers/forms/paymentMethods';
import {
	getStripeKey,
	stripeAccountForContributionType,
} from 'helpers/forms/stripe';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import StripeCardForm from './StripeCardForm';
import './stripeCardForm.scss';

// ----- Types -----//
type PropTypes = {
	country: IsoCountry;
	currency: IsoCurrency;
	isTestUser: boolean;
	contributionType: ContributionType;
	paymentMethod: PaymentMethod;
};

function StripeCardFormContainer(props: PropTypes): JSX.Element | null {
	const stripeAccount =
		stripeAccountForContributionType[props.contributionType];
	const stripeKey = getStripeKey(
		stripeAccount,
		props.country,
		props.isTestUser,
	);
	const stripeObjects = useStripeObjects(stripeAccount, stripeKey);
	const maybeStripeSDK = stripeObjects[stripeAccount];

	if (props.paymentMethod === Stripe) {
		if (maybeStripeSDK) {
			// `options` must be set even if it's empty, otherwise we get 'Unsupported prop change on Elements' warnings
			// in the console
			const elementsOptions = {};

			/**
			 * The `key` attribute is necessary here because you cannot update the stripe object on the Elements.
			 * Instead, we create separate instances for ONE_OFF and REGULAR
			 */
			return (
				<div className="stripe-card-element-container" key={stripeAccount}>
					<Elements stripe={maybeStripeSDK} options={elementsOptions}>
						<StripeCardForm stripeKey={stripeKey} />
					</Elements>
				</div>
			);
		}

		return <AnimatedDots appearance="dark" />;
	}

	return null;
}

export default StripeCardFormContainer;
