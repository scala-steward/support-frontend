// ----- Imports ----- //
import { css } from '@emotion/core';
import { Button } from '@guardian/src-button';
import { space } from '@guardian/src-foundations';
import { PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import * as stripeJs from '@stripe/react-stripe-js';
import type {
	PaymentIntentResult,
	PaymentRequest,
	PaymentRequestCompleteStatus,
	PaymentRequestPaymentMethodEvent,
	Stripe as StripeJs,
	StripePaymentRequestButtonElementClickEvent,
} from '@stripe/stripe-js';
import React, { useEffect, useState } from 'react';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import type { ThunkDispatch } from 'redux-thunk';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import { fetchJson, requestOptions } from 'helpers/async/fetch';
import {
	getAvailablePaymentRequestButtonPaymentMethod,
	toHumanReadableContributionType,
} from 'helpers/forms/checkouts';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import {
	amountOrOtherAmountIsValid,
	isValidEmail,
} from 'helpers/forms/formValidation';
import type {
	PaymentAuthorisation,
	PaymentResult,
	StripePaymentMethod,
	StripePaymentRequestButtonMethod,
} from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import { Stripe } from 'helpers/forms/paymentMethods';
import type { StripeAccount } from 'helpers/forms/stripe';
import type {
	IsoCountry,
	StateProvince,
} from 'helpers/internationalisation/country';
import {
	findIsoCountry,
	stateProvinceFromString,
} from 'helpers/internationalisation/country';
import {
	trackComponentClick,
	trackComponentLoad,
} from 'helpers/tracking/behaviour';
import type { Option } from 'helpers/types/option';
import { logException } from 'helpers/utilities/logger';
import {
	onThirdPartyPaymentAuthorised,
	setHandleStripe3DS,
	setPaymentRequestButtonPaymentMethod,
	paymentWaiting as setPaymentWaiting,
	setStripePaymentRequestButtonClicked,
	setStripePaymentRequestButtonError,
	updateBillingCountry,
	updateBillingState,
	updateEmail,
	updateFirstName,
	updateLastName,
	updatePaymentMethod,
} from 'pages/contributions-landing/contributionsLandingActions';
import type { Action } from 'pages/contributions-landing/contributionsLandingActions';
import type { State } from 'pages/contributions-landing/contributionsLandingReducer';
import { trackComponentEvents } from '../../../../helpers/tracking/ophan';

// ----- Types -----//

interface PropsFromParent {
	paymentRequestObject: PaymentRequest | null;
	setPaymentRequestObject: (paymentRequestObject: PaymentRequest) => void;
	amount: number;
	stripeAccount: StripeAccount;
	stripeKey: string;
}

const mapStateToProps = (state: State, ownProps: PropsFromParent) => ({
	selectedAmounts: state.page.form.selectedAmounts,
	otherAmounts: state.page.form.formData.otherAmounts,
	stripePaymentRequestButtonData:
		state.page.form.stripePaymentRequestButtonData[ownProps.stripeAccount],
	countryGroupId: state.common.internationalisation.countryGroupId,
	country: state.common.internationalisation.countryId,
	billingState: state.page.form.formData.billingState,
	currency: state.common.internationalisation.currencyId,
	isTestUser: state.page.user.isTestUser ?? false,
	contributionType: state.page.form.contributionType,
	paymentMethod: state.page.form.paymentMethod,
	csrf: state.page.csrf,
	localCurrencyCountry: state.common.internationalisation.localCurrencyCountry,
	useLocalCurrency: state.common.internationalisation.useLocalCurrency,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<State, void, Action>) => ({
	onPaymentAuthorised: (paymentAuthorisation: PaymentAuthorisation) =>
		dispatch(onThirdPartyPaymentAuthorised(paymentAuthorisation)),
	setPaymentRequestButtonPaymentMethod: (
		paymentMethod: StripePaymentRequestButtonMethod,
		stripeAccount: StripeAccount,
	) =>
		dispatch(
			setPaymentRequestButtonPaymentMethod(paymentMethod, stripeAccount),
		),
	updateEmail: (email: string) => dispatch(updateEmail(email)),
	updateFirstName: (firstName: string) => dispatch(updateFirstName(firstName)),
	updateLastName: (lastName: string) => dispatch(updateLastName(lastName)),
	updateBillingState: (billingState: StateProvince | null) =>
		dispatch(updateBillingState(billingState)),
	updateBillingCountry: (billingCountry: IsoCountry) =>
		dispatch(updateBillingCountry(billingCountry)),
	setStripePaymentRequestButtonClicked: (stripeAccount: StripeAccount) =>
		dispatch(setStripePaymentRequestButtonClicked(stripeAccount)),
	setAssociatedPaymentMethod: () => dispatch(updatePaymentMethod(Stripe)),
	setPaymentWaiting: (isWaiting: boolean) =>
		dispatch(setPaymentWaiting(isWaiting)),
	setError: (error: ErrorReason, stripeAccount: StripeAccount) =>
		dispatch(setStripePaymentRequestButtonError(error, stripeAccount)),
	setHandleStripe3DS: (
		handleStripe3DS: (clientSecret: string) => Promise<PaymentIntentResult>,
	) => dispatch(setHandleStripe3DS(handleStripe3DS)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type PropTypes = PropsFromRedux & PropsFromParent;

// ----- Functions -----//

function updatePayerEmail(
	email: string | undefined,
	setEmail: (email: string) => void,
) {
	if (email) {
		if (isValidEmail(email)) {
			setEmail(email);
		} else {
			logException(
				`Failed to set email for stripe payment request user with email: ${email}`,
			);
		}
	} else {
		logException('Failed to set email: no email in data object');
	}
}

function updatePayerName(
	payerName: string | undefined,
	setFirstName: (firstName: string) => void,
	setLastName: (lastName: string) => void,
): boolean {
	// NB: This turns "    jean    claude    van    damme     " into ["jean", "claude", "van", "damme"]
	const nameParts = payerName?.trim().replace(/\s+/g, ' ').split(' ') ?? [];

	if (nameParts.length > 2) {
		setFirstName(nameParts[0]);
		setLastName(nameParts.slice(1).join(' '));
		return true;
	} else if (nameParts.length === 2) {
		setFirstName(nameParts[0]);
		setLastName(nameParts[1]);
		return true;
	} else if (nameParts.length === 1) {
		logException(
			`Failed to set name: no spaces in data object: ${nameParts.join('')}`,
		);
		return false;
	}

	logException('Failed to set name: no name in data object');
	return false;
}

const onComplete = (res: PaymentResult) => {
	if (res.paymentStatus === 'success') {
		trackComponentClick('apple-pay-payment-complete');
	}
};

function updateTotal(props: PropTypes) {
	// When the other tab is clicked, the value of amount is NaN
	if (!Number.isNaN(props.amount) && props.paymentRequestObject) {
		props.paymentRequestObject.update({
			total: {
				label: `${toHumanReadableContributionType(
					props.contributionType,
				)} Contribution`,
				amount: props.amount * 100,
			},
			currency: props.currency.toLowerCase(),
		});
	}
}

// We need to intercept the click ourselves because we need to check
// that the user has entered a valid amount before we allow them to continue
function getClickHandler(props: PropTypes, isCustomPrb: boolean) {
	function onClick(event: StripePaymentRequestButtonElementClickEvent) {
		trackComponentClick('apple-pay-clicked');
		updateTotal(props);
		props.setAssociatedPaymentMethod();
		props.setStripePaymentRequestButtonClicked(props.stripeAccount);
		const amountIsValid = amountOrOtherAmountIsValid(
			props.selectedAmounts,
			props.otherAmounts,
			props.contributionType,
			props.countryGroupId,
			props.localCurrencyCountry,
			props.useLocalCurrency,
		);

		if (isCustomPrb && amountIsValid && props.paymentRequestObject) {
			props.paymentRequestObject.show();
		} else if (!isCustomPrb && !amountIsValid) {
			event.preventDefault();
		}
	}

	return onClick;
}

// Requests a new SetupIntent and returns the associated clientSecret
function fetchClientSecret(props: PropTypes): Promise<string> {
	return fetchJson(
		'/stripe/create-setup-intent/prb',
		requestOptions(
			{
				stripePublicKey: props.stripeKey,
			},
			'omit',
			'POST',
			props.csrf,
		),
	).then((result) => {
		if (result.client_secret) {
			return Promise.resolve(result.client_secret as string);
		}

		return Promise.reject(
			new Error('Missing client_secret field in response for PRB'),
		);
	});
}

// General handler for tasks common to both SCA and non-SCA payments.
// The given processPayment function handles any specific payment completion tasks.
function onPayment(
	props: PropTypes,
	paymentRequestComplete: (status: PaymentRequestCompleteStatus) => void,
	paymentMethodEvent: PaymentRequestPaymentMethodEvent,
	billingCountryFromCard: string | null,
	billingStateFromCard: string | null,
	processPayment: () => void,
): void {
	// Always dismiss the payment popup immediately - any pending/success/failure will be displayed on our own page.
	// This is because `complete` must be called within 30 seconds or the user will see an error.
	// Our backend (support-workers) can in extreme cases take longer than this, so we must call complete now.
	// This means that the browser's payment popup will be dismissed, and our own 'spinner' will be displayed until
	// the backend job finishes.
	paymentRequestComplete('success');
	// We always need an email address to do ecommerce on support.theguardian.com
	updatePayerEmail(paymentMethodEvent.payerEmail, props.updateEmail);
	// Single doesn't need a name, but recurring (i.e. Zuora and Salesforce) needs a non-empty first and last name.
	const nameValueOk: boolean =
		props.contributionType === 'ONE_OFF' ||
		updatePayerName(
			paymentMethodEvent.payerName,
			props.updateFirstName,
			props.updateLastName,
		);
	// Single doesn't need a state, however recurring (i.e. Zuora) needs a valid state for US and CA billing countries.
	const validatedCountryFromCard: Option<IsoCountry> = findIsoCountry(
		billingCountryFromCard ?? undefined,
	);
	const billingAccountRequiresAState =
		props.contributionType !== 'ONE_OFF' &&
		['US', 'CA'].includes(validatedCountryFromCard ?? '');
	let countryAndStateValueOk = !billingAccountRequiresAState; // If Zuora requires a state then we're not OK yet.

	if (validatedCountryFromCard) {
		const validatedBillingStateFromCard: Option<StateProvince> =
			stateProvinceFromString(
				validatedCountryFromCard,
				billingStateFromCard ?? undefined,
			);

		if (billingAccountRequiresAState && !validatedBillingStateFromCard) {
			logException(
				`Invalid billing state: ${
					billingStateFromCard ?? ''
				} for billing country: ${billingCountryFromCard ?? ''}`,
			); // Don't update the form, because the user may pick another payment method that doesn't update formData.
		} else {
			// Update the form data with the billing country value and a valid-or-null billing state
			props.updateBillingCountry(validatedCountryFromCard);
			props.updateBillingState(validatedBillingStateFromCard);
			countryAndStateValueOk = true;
		}
	}

	if (nameValueOk && countryAndStateValueOk) {
		if (paymentMethodEvent.methodName) {
			// https://stripe.com/docs/stripe-js/reference#payment-response-object
			// methodName:
			// "The unique name of the payment handler the customer
			// chose to authorize payment. For example, 'basic-card'."
			trackComponentClick(`${paymentMethodEvent.methodName}-paymentAuthorised`);
		}

		props.setPaymentWaiting(true);
		processPayment();
	} else {
		props.setError('incomplete_payment_request_details', props.stripeAccount);
	}
}

function setUpPaymentListenerSca(
	props: PropTypes,
	stripe: StripeJs,
	paymentRequest: PaymentRequest,
	stripePaymentMethod: StripePaymentMethod,
) {
	paymentRequest.on('paymentmethod', (paymentMethodEvent) => {
		const { complete, paymentMethod } = paymentMethodEvent;

		const processPayment = () => {
			const walletType =
				(paymentMethod.card?.wallet?.type as string | null) ?? 'no-wallet';

			trackComponentEvents({
				component: {
					componentType: 'ACQUISITIONS_OTHER',
				},
				action: 'CLICK',
				id: 'stripe-prb-wallet',
				value: walletType,
			});

			if (props.contributionType === 'ONE_OFF') {
				void props
					.onPaymentAuthorised({
						paymentMethod: Stripe,
						paymentMethodId: paymentMethod.id,
						stripePaymentMethod,
					})
					.then(onComplete);
			} else {
				// For recurring we need to request a new SetupIntent,
				// and then provide the associated clientSecret for confirmation
				fetchClientSecret(props)
					.then((clientSecret: string) => {
						void stripe
							.confirmCardSetup(clientSecret, {
								payment_method: paymentMethod.id,
							})
							.then((confirmResult) => {
								if (confirmResult.error) {
									props.setError(
										'card_authentication_error',
										props.stripeAccount,
									);
									props.setPaymentWaiting(false);
								} else {
									void props
										.onPaymentAuthorised({
											paymentMethod: Stripe,
											paymentMethodId: paymentMethod.id,
											stripePaymentMethod,
										})
										.then(onComplete);
								}
							});
					})
					.catch((error) => {
						if (error instanceof Error) {
							logException(
								`Error confirming recurring contribution from Payment Request Button: - message: ${error.message}`,
							);
						} else {
							logException(
								'Error confirming recurring contribution from Payment Request Button',
							);
						}
						props.setError('internal_error', props.stripeAccount);
						props.setPaymentWaiting(false);
					});
			}
		};

		onPayment(
			props,
			complete,
			paymentMethodEvent,
			paymentMethod.billing_details.address?.country ?? null,
			paymentMethod.billing_details.address?.state ?? null,
			processPayment,
		);
	});
}

const paymentButtonStyle = {
	paymentRequestButton: {
		theme: 'dark',
		height: '42px',
	},
} as const;

// ---- Styles ----- //

const customPrbStyles = css`
	width: 100%;
	justify-content: center;
	margin: ${space[6]}px 0;
	background: #323457;

	&:hover {
		background: #1c1d31;
	}
`;

type PrbType = 'APPLE_PAY' | 'GOOGLE_PAY' | 'PAY_NOW' | 'NONE';

// ---- Component ----- //

function PaymentRequestButton(props: PropTypes) {
	const stripe = stripeJs.useStripe();
	const [prbType, setPrbType] = useState<PrbType>('NONE');

	function initialisePaymentRequest() {
		if (!stripe) {
			return;
		}

		const paymentRequestObject = stripe.paymentRequest({
			country: props.country,
			currency: props.currency.toLowerCase(),
			total: {
				label: `${toHumanReadableContributionType(
					props.contributionType,
				)} Contribution`,
				amount: props.amount * 100,
			},
			requestPayerEmail: true,
			requestPayerName: props.contributionType !== 'ONE_OFF',
		});

		void paymentRequestObject.canMakePayment().then((result) => {
			const paymentMethod = getAvailablePaymentRequestButtonPaymentMethod(
				result,
				props.contributionType,
			);

			if (paymentMethod) {
				trackComponentLoad(`${paymentMethod}-loaded`);

				if (result?.applePay) {
					setPrbType('APPLE_PAY');
				} else if (result?.googlePay) {
					setPrbType('GOOGLE_PAY');
				} else if (result) {
					setPrbType('PAY_NOW');
				}

				const isUkOrEuRecurring =
					props.contributionType !== 'ONE_OFF' &&
					(props.countryGroupId === 'GBPCountries' ||
						props.countryGroupId === 'EURCountries');
				const shouldShowPrb =
					Boolean(result?.applePay) ||
					Boolean(result?.googlePay) ||
					!isUkOrEuRecurring;

				if (shouldShowPrb) {
					trackComponentLoad(`${paymentMethod}-displayed`);
					props.setPaymentRequestButtonPaymentMethod(
						paymentMethod,
						props.stripeAccount,
					);
					setUpPaymentListenerSca(
						props,
						stripe,
						paymentRequestObject,
						paymentMethod,
					);
				}
			} else {
				props.setPaymentRequestButtonPaymentMethod('none', props.stripeAccount);
			}
		});

		// Only need 3DS handler for one-offs - recurring has its own special flow via confirmCardSetup
		if (props.contributionType === 'ONE_OFF') {
			props.setHandleStripe3DS((clientSecret: string) => {
				trackComponentLoad('stripe-3ds');
				return stripe.handleCardAction(clientSecret);
			});
		}

		props.setPaymentRequestObject(paymentRequestObject);
	}

	useEffect(() => {
		// Call canMakePayment on the paymentRequest object only once, once the stripe object is ready
		if (stripe && !props.paymentRequestObject) {
			initialisePaymentRequest();
		}
	}, [stripe, props.paymentRequestObject]);
	useEffect(() => {
		if (props.paymentRequestObject) {
			void props.paymentRequestObject.canMakePayment().then((result) => {
				if (result?.applePay) {
					setPrbType('APPLE_PAY');
				} else if (result?.googlePay) {
					setPrbType('GOOGLE_PAY');
				} else if (result) {
					setPrbType('PAY_NOW');
				}
			});
		}
	}, [props.paymentRequestObject]);

	if (
		!props.paymentRequestObject ||
		props.stripePaymentRequestButtonData.paymentMethod === 'none'
	) {
		return null;
	}

	const shouldShowStripePrb =
		prbType === 'APPLE_PAY' || prbType === 'GOOGLE_PAY';
	return (
		<div
			className="stripe-payment-request-button__container"
			data-for-stripe-account={props.stripeAccount}
			data-for-contribution-type={props.contributionType}
		>
			{shouldShowStripePrb ? (
				<PaymentRequestButtonElement
					options={{
						paymentRequest: props.paymentRequestObject,
						style: paymentButtonStyle,
					}}
					className="stripe-payment-request-button__button"
					onClick={getClickHandler(props, false)}
				/>
			) : (
				<div>
					<Button onClick={getClickHandler(props, true)} css={customPrbStyles}>
						Pay with saved card
					</Button>
				</div>
			)}

			{props.stripePaymentRequestButtonData.paymentError && (
				<GeneralErrorMessage
					errorReason={props.stripePaymentRequestButtonData.paymentError}
				/>
			)}

			<div className="stripe-payment-request-button__divider">or</div>
		</div>
	);
}

export default connector(PaymentRequestButton);
