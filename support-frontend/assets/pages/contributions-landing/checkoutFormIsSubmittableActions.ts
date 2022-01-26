// ----- Imports ----- //
import type { Dispatch } from 'redux';
import type {
	ContributionType,
	OtherAmounts,
	SelectedAmounts,
} from 'helpers/contributions';
import { contributionTypeIsRecurring } from 'helpers/contributions';
import {
	amountOrOtherAmountIsValid,
	checkEmail,
	checkFirstName,
	checkLastName,
	checkStateIfApplicable,
	isValidIban,
} from 'helpers/forms/formValidation';
import { AmazonPay, Sepa } from 'helpers/forms/paymentMethods';
import { stripeCardFormIsIncomplete } from 'helpers/forms/stripe';
import type { StateProvince } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { LocalCurrencyCountry } from '../../helpers/internationalisation/localCurrencyCountry';
import { setFormIsValid } from './contributionsLandingActions';
import type { Action as ContributionsLandingAction } from './contributionsLandingActions';
import type { State } from './contributionsLandingReducer';

// ----- Types ----- //
type Action = ContributionsLandingAction;

// ----- Functions ----- //
const enableOrDisablePayPalExpressCheckoutButton = (
	formIsSubmittable: boolean,
) => {
	if (formIsSubmittable && window.enablePayPalButton) {
		window.enablePayPalButton();
	} else if (window.disablePayPalButton) {
		window.disablePayPalButton();
	}
};

const setFormIsSubmittable = (
	formIsSubmittable: boolean,
	payPalButtonReady: boolean,
): Action => {
	if (payPalButtonReady) {
		enableOrDisablePayPalExpressCheckoutButton(formIsSubmittable);
	}

	return {
		type: 'SET_FORM_IS_SUBMITTABLE',
		formIsSubmittable,
	};
};

export type FormIsValidParameters = {
	selectedAmounts: SelectedAmounts;
	otherAmounts: OtherAmounts;
	countryGroupId: CountryGroupId;
	contributionType: ContributionType;
	billingState: StateProvince | null;
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	stripeCardFormOk: boolean;
	amazonPayFormOk: boolean;
	sepaFormOk: boolean;
	localCurrencyCountry?: LocalCurrencyCountry;
	useLocalCurrency?: boolean;
};

const getFormIsValid = (formIsValidParameters: FormIsValidParameters) => {
	const {
		selectedAmounts,
		otherAmounts,
		countryGroupId,
		contributionType,
		billingState,
		firstName,
		lastName,
		email,
		stripeCardFormOk,
		amazonPayFormOk,
		sepaFormOk,
		localCurrencyCountry,
		useLocalCurrency,
	} = formIsValidParameters;
	const hasNameFields = contributionType !== 'ONE_OFF';
	return (
		(hasNameFields
			? checkFirstName(firstName) && checkLastName(lastName)
			: true) &&
		checkEmail(email) &&
		stripeCardFormOk &&
		amazonPayFormOk &&
		sepaFormOk &&
		checkStateIfApplicable(billingState, countryGroupId, contributionType) &&
		amountOrOtherAmountIsValid(
			selectedAmounts,
			otherAmounts,
			contributionType,
			countryGroupId,
			localCurrencyCountry,
			useLocalCurrency,
		)
	);
};

const amazonPayFormOk = (state: State): boolean => {
	if (state.page.form.paymentMethod === AmazonPay) {
		const {
			orderReferenceId,
			amazonBillingAgreementId,
			amazonBillingAgreementConsentStatus,
			paymentSelected,
		} = state.page.form.amazonPayData;

		const oneOffOk = () => !!orderReferenceId;

		const recurringOk = () =>
			!!amazonBillingAgreementId && amazonBillingAgreementConsentStatus;

		return (
			paymentSelected &&
			(state.page.form.contributionType === 'ONE_OFF'
				? oneOffOk()
				: recurringOk())
		);
	}

	return true;
};

const sepaFormOk = (state: State): boolean => {
	if (state.page.form.paymentMethod === Sepa) {
		const { accountHolderName, iban } = state.page.form.sepaData;
		return !!accountHolderName && isValidIban(iban);
	}

	return true;
};

const formIsValidParameters = (state: State) => ({
	selectedAmounts: state.page.form.selectedAmounts,
	otherAmounts: state.page.form.formData.otherAmounts,
	countryGroupId: state.common.internationalisation.countryGroupId,
	contributionType: state.page.form.contributionType,
	billingState: state.page.form.formData.billingState,
	firstName: state.page.form.formData.firstName,
	lastName: state.page.form.formData.lastName,
	email: state.page.form.formData.email,
	stripeCardFormOk: !stripeCardFormIsIncomplete(
		state.page.form.paymentMethod,
		state.page.form.stripeCardFormData.formComplete,
	),
	amazonPayFormOk: amazonPayFormOk(state),
	sepaFormOk: sepaFormOk(state),
	localCurrencyCountry: state.common.internationalisation.localCurrencyCountry,
	useLocalCurrency: state.common.internationalisation.useLocalCurrency,
});

function enableOrDisableForm() {
	return (dispatch: Dispatch, getState: () => State): void => {
		const state = getState();
		const { isRecurringContributor } = state.page.user;
		const shouldBlockExistingRecurringContributor =
			isRecurringContributor &&
			contributionTypeIsRecurring(state.page.form.contributionType);
		const formIsValid = getFormIsValid(formIsValidParameters(state));
		dispatch(setFormIsValid(formIsValid));
		const recaptchaRequired =
			window.guardian.recaptchaEnabled &&
			state.page.form.paymentMethod === 'Stripe' &&
			!state.page.user.isPostDeploymentTestUser;
		const recaptchaVerified =
			state.page.form.contributionType !== 'ONE_OFF'
				? state.page.form.stripeCardFormData.recurringRecaptchaVerified
				: !!state.page.form.oneOffRecaptchaToken;
		const shouldEnable =
			formIsValid &&
			!shouldBlockExistingRecurringContributor &&
			(!recaptchaRequired || recaptchaVerified);
		dispatch(
			setFormIsSubmittable(
				shouldEnable,
				state.page.form.payPalData.buttonReady,
			),
		);
	};
}

function setFormSubmissionDependentValue(setStateValue: () => Action) {
	return (dispatch: Dispatch, getState: () => State): void => {
		dispatch(setStateValue());
		enableOrDisableForm()(dispatch, getState);
	};
}

export { setFormSubmissionDependentValue, enableOrDisableForm };
