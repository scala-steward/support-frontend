// ----- Imports ----- //
import { css } from '@emotion/react';
import { TextArea } from '@guardian/src-text-area';
import React from 'react';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import 'redux';
import Form, {
	FormSection,
	FormSectionHiddenUntilSelected,
} from 'components/checkoutForm/checkoutForm';
import DatePickerFields from 'components/datePicker/datePicker';
import DirectDebitForm from 'components/directDebit/directDebitProgressiveDisclosure/directDebitForm';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import GridImage from 'components/gridImage/gridImage';
import { withStore } from 'components/subscriptionCheckouts/address/addressFields';
import DirectDebitPaymentTerms from 'components/subscriptionCheckouts/directDebit/directDebitPaymentTerms';
import CheckoutLayout, {
	Content,
} from 'components/subscriptionCheckouts/layout';
import { PaymentMethodSelector } from 'components/subscriptionCheckouts/paymentMethodSelector';
import { PayPalSubmitButton } from 'components/subscriptionCheckouts/payPalSubmitButton';
import PersonalDetails from 'components/subscriptionCheckouts/personalDetails';
import { PersonalDetailsDigitalGift } from 'components/subscriptionCheckouts/personalDetailsGift';
import { StripeProviderForCountry } from 'components/subscriptionCheckouts/stripeForm/stripeProviderForCountry';
import { setupSubscriptionPayPalPaymentNoShipping } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import { DirectDebit, PayPal, Stripe } from 'helpers/forms/paymentMethods';
import { countries } from 'helpers/internationalisation/country';
import type { DigitalBillingPeriod } from 'helpers/productPrice/billingPeriods';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import {
	finalPrice,
	getProductPrice,
} from 'helpers/productPrice/productPrices';
import { DigitalPack } from 'helpers/productPrice/subscriptions';
import { supportedPaymentMethods } from 'helpers/subscriptionsForms/countryPaymentMethods';
import { formActionCreators } from 'helpers/subscriptionsForms/formActions';
import type { Action } from 'helpers/subscriptionsForms/formActions';
import { getFormFields } from 'helpers/subscriptionsForms/formFields';
import {
	checkoutFormIsValid,
	validateCheckoutForm,
} from 'helpers/subscriptionsForms/formValidation';
import {
	submitCheckoutForm,
	trackSubmitAttempt,
} from 'helpers/subscriptionsForms/submit';
import { getBillingAddress } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { firstError } from 'helpers/subscriptionsForms/validation';
import { routes } from 'helpers/urls/routes';
import { signOut } from 'helpers/user/user';
import { withError } from 'hocs/withError';
import EndSummaryMobile from 'pages/digital-subscription-checkout/components/endSummary/endSummaryMobile';
import OrderSummary from 'pages/digital-subscription-checkout/components/orderSummary/orderSummary';

const controlTextAreaResizing = css`
	resize: vertical;
`;

// ----- Map State/Props ----- //
function mapStateToProps(state: CheckoutState) {
	return {
		...getFormFields(state),
		country: state.common.internationalisation.countryId,
		formErrors: state.page.checkout.formErrors,
		submissionError: state.page.checkout.submissionError,
		productPrices: state.page.checkout.productPrices,
		currencyId: state.common.internationalisation.currencyId,
		csrf: state.page.csrf,
		payPalHasLoaded: state.page.checkout.payPalHasLoaded,
		paymentMethod: state.page.checkout.paymentMethod,
		isTestUser: state.page.checkout.isTestUser,
		amount: finalPrice(
			state.page.checkout.productPrices,
			state.common.internationalisation.countryId,
			state.page.checkout.billingPeriod,
		).price,
		billingPeriod: state.page.checkout.billingPeriod as DigitalBillingPeriod,
		addressErrors: state.page.billingAddress.fields.formErrors,
		participations: state.common.abParticipations,
	};
}

// ----- Map Dispatch/Props ----- //
function mapDispatchToProps() {
	return {
		...formActionCreators,
		formIsValid:
			() => (dispatch: Dispatch<Action>, getState: () => CheckoutState) =>
				checkoutFormIsValid(getState()),
		submitForm:
			() => (dispatch: Dispatch<Action>, getState: () => CheckoutState) =>
				submitCheckoutForm(dispatch, getState()),
		validateForm:
			() => (dispatch: Dispatch<Action>, getState: () => CheckoutState) => {
				const state = getState();
				validateCheckoutForm(dispatch, state);
				// We need to track PayPal payment attempts here because PayPal behaves
				// differently to other payment methods. All others are tracked in submit.js
				const { paymentMethod } = state.page.checkout;

				if (paymentMethod === PayPal) {
					trackSubmitAttempt(PayPal, DigitalPack, NoProductOptions);
				}
			},
		setupRecurringPayPalPayment: setupSubscriptionPayPalPaymentNoShipping,
		signOut,
	};
}

const connector = connect(mapStateToProps, mapDispatchToProps());

// ----- Types ----- //
type PropTypes = ConnectedProps<typeof connector>;

const DatePickerWithError = withError(DatePickerFields);
const Address = withStore(countries, 'billing', getBillingAddress);

// ----- Component ----- //
function DigitalCheckoutFormGift(props: PropTypes): JSX.Element {
	const productPrice = getProductPrice(
		props.productPrices,
		props.country,
		props.billingPeriod,
	);
	const submissionErrorHeading =
		props.submissionError === 'personal_details_incorrect'
			? 'Sorry there was a problem'
			: 'Sorry we could not process your payment';
	const paymentMethods = supportedPaymentMethods(
		props.currencyId,
		props.country,
	);
	return (
		<Content>
			<CheckoutLayout
				aside={
					<OrderSummary
						image={
							<GridImage
								gridId={
									props.country === 'AU'
										? 'editionsPackshotAusShort'
										: 'editionsPackshotShort'
								}
								srcSizes={[1000, 500]}
								sizes="(max-width: 740px) 50vw, 500"
								imgType="png"
								altText=""
							/>
						}
						title="Digital Gift Subscription"
						productPrice={productPrice}
						billingPeriod={props.billingPeriod}
						changeSubscription={routes.digitalSubscriptionLandingGift}
						orderIsAGift
					/>
				}
			>
				<Form
					onSubmit={(ev: React.FormEvent<HTMLFormElement>) => {
						ev.preventDefault();
						props.submitForm();
					}}
				>
					<FormSection title="Gift recipient's details">
						<PersonalDetailsDigitalGift
							firstNameGiftRecipient={props.firstNameGiftRecipient ?? ''}
							setFirstNameGift={props.setFirstNameGift}
							lastNameGiftRecipient={props.lastNameGiftRecipient ?? ''}
							setLastNameGift={props.setLastNameGift}
							emailGiftRecipient={props.emailGiftRecipient ?? ''}
							setEmailGift={props.setEmailGift}
							formErrors={props.formErrors}
						/>
					</FormSection>
					<FormSection title="Gift delivery date">
						<DatePickerWithError
							error={firstError('giftDeliveryDate', props.formErrors) as string}
							value={props.giftDeliveryDate}
							onChange={(date) => props.setDigitalGiftDeliveryDate(date)}
						/>
					</FormSection>
					<FormSection title="Personalise your gift">
						<TextArea
							css={controlTextAreaResizing}
							id="gift-message"
							label="Gift message"
							maxLength={300}
							value={props.giftMessage ?? ''}
							onChange={(e) => props.setGiftMessage(e.target.value)}
							optional
						/>
					</FormSection>
					<FormSection title="Your details" border="top">
						<PersonalDetails
							firstName={props.firstName}
							setFirstName={props.setFirstName}
							lastName={props.lastName}
							setLastName={props.setLastName}
							email={props.email}
							setEmail={props.setEmail}
							confirmEmail={props.confirmEmail}
							setConfirmEmail={props.setConfirmEmail}
							isSignedIn={props.isSignedIn}
							telephone={props.telephone}
							setTelephone={props.setTelephone}
							formErrors={props.formErrors}
							signOut={props.signOut}
						/>
					</FormSection>
					<FormSection title="Billing address">
						<Address />
					</FormSection>
					{paymentMethods.length > 1 ? (
						<FormSection title="How would you like to pay?">
							<PaymentMethodSelector
								availablePaymentMethods={paymentMethods}
								paymentMethod={props.paymentMethod}
								setPaymentMethod={props.setPaymentMethod}
								validationError={
									firstError('paymentMethod', props.formErrors) as string
								}
							/>
						</FormSection>
					) : null}
					<FormSectionHiddenUntilSelected
						id="stripeForm"
						show={props.paymentMethod === Stripe}
						title="Your card details"
					>
						<StripeProviderForCountry
							country={props.country}
							isTestUser={props.isTestUser}
							submitForm={props.submitForm}
							// @ts-expect-error TODO: Fixing the types around validation errors will affect every checkout, too much to tackle now
							allErrors={[...props.formErrors, ...props.addressErrors]}
							setStripePaymentMethod={props.setStripePaymentMethod}
							validateForm={props.validateForm}
							buttonText="Pay for your gift"
							csrf={props.csrf}
						/>
					</FormSectionHiddenUntilSelected>
					<FormSectionHiddenUntilSelected
						id="directDebitForm"
						show={props.paymentMethod === DirectDebit}
						title="Your account details"
					>
						<DirectDebitForm
							buttonText="Pay for your gift"
							submitForm={props.submitForm}
							allErrors={[...props.formErrors, ...props.addressErrors]}
							submissionError={props.submissionError}
							submissionErrorHeading={submissionErrorHeading}
						/>
					</FormSectionHiddenUntilSelected>
					{props.paymentMethod === PayPal ? (
						<PayPalSubmitButton
							paymentMethod={props.paymentMethod}
							onPaymentAuthorised={props.onPaymentAuthorised}
							csrf={props.csrf}
							currencyId={props.currencyId}
							payPalHasLoaded={props.payPalHasLoaded}
							formIsValid={props.formIsValid}
							validateForm={props.validateForm}
							isTestUser={props.isTestUser}
							setupRecurringPayPalPayment={props.setupRecurringPayPalPayment}
							amount={props.amount}
							billingPeriod={props.billingPeriod}
							// @ts-expect-error TODO: Fixing the types around validation errors will affect every checkout, too much to tackle now
							allErrors={[...props.formErrors, ...props.addressErrors]}
						/>
					) : null}
					<GeneralErrorMessage
						errorReason={props.submissionError}
						errorHeading={submissionErrorHeading}
					/>
					<EndSummaryMobile orderIsAGift />
					<DirectDebitPaymentTerms paymentMethod={props.paymentMethod} />
				</Form>
			</CheckoutLayout>
		</Content>
	);
} // ----- Exports ----- //

export default connector(DigitalCheckoutFormGift);
