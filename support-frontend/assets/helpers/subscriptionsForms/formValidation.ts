import type { Dispatch } from 'redux';
import { DigitalPack } from 'helpers/productPrice/subscriptions';
import {
	setBillingAddressFormErrors,
	setDeliveryAddressFormErrors,
} from 'helpers/redux/checkout/address/actions';
import type { AddressFormField } from 'helpers/redux/checkout/address/state';
import {
	applyBillingAddressRules,
	applyDeliveryAddressRules,
} from 'helpers/redux/checkout/address/validation';
import type { SubscriptionsState } from 'helpers/redux/subscriptionsStore';
import type { Action } from 'helpers/subscriptionsForms/formActions';
import { setFormErrors } from 'helpers/subscriptionsForms/formActions';
import type {
	FormField,
	FormFields,
} from 'helpers/subscriptionsForms/formFields';
import { getFormFields } from 'helpers/subscriptionsForms/formFields';
import { getFulfilmentOption } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import { applyCheckoutRules, applyDeliveryRules } from './rules';

type Error<T> = {
	errors: Array<FormError<T>>;
	errorAction: (arg0: any) => Action;
};
type AnyErrorType = Error<AddressFormField> | Error<FormField>;

function checkoutValidation(state: SubscriptionsState): AnyErrorType[] {
	return [
		{
			errors: applyCheckoutRules(getFormFields(state)),
			errorAction: setFormErrors,
		} as Error<FormField>,
		{
			errors: applyBillingAddressRules(
				state.page.checkoutForm.billingAddress.fields,
			),
			errorAction: setBillingAddressFormErrors,
		} as Error<AddressFormField>,
	].filter(({ errors }) => errors.length > 0);
}

const shouldValidateBillingAddress = (fields: FormFields) =>
	!fields.billingAddressIsSame;

function withDeliveryValidation(state: SubscriptionsState): AnyErrorType[] {
	const formFields = getFormFields(state);
	return [
		{
			errors: applyDeliveryRules(formFields),
			errorAction: setFormErrors,
		} as Error<FormField>,
		{
			errors: applyDeliveryAddressRules(
				getFulfilmentOption(state),
				state.page.checkoutForm.deliveryAddress.fields,
			),
			errorAction: setDeliveryAddressFormErrors,
		} as Error<AddressFormField>,
		...(shouldValidateBillingAddress(formFields)
			? [
					{
						errors: applyBillingAddressRules(
							state.page.checkoutForm.billingAddress.fields,
						),
						errorAction: setBillingAddressFormErrors,
					} as Error<AddressFormField>,
			  ]
			: []),
	].filter(({ errors }) => errors.length > 0);
}

function dispatchErrors(dispatch: Dispatch<Action>, allErrors: AnyErrorType[]) {
	allErrors.forEach(({ errors, errorAction }) => {
		dispatch(errorAction(errors));
	});
}

function validateCheckoutForm(
	dispatch: Dispatch<Action>,
	state: SubscriptionsState,
): boolean {
	const allErrors = checkoutValidation(state);
	dispatchErrors(dispatch, allErrors);
	return allErrors.length === 0;
}

function validateWithDeliveryForm(
	dispatch: Dispatch<Action>,
	state: SubscriptionsState,
): boolean {
	const allErrors = withDeliveryValidation(state);
	dispatchErrors(dispatch, allErrors);
	return allErrors.length === 0;
}

const checkoutFormIsValid = (state: SubscriptionsState) => {
	if (state.page.checkoutForm.product.productType === DigitalPack) {
		return checkoutValidation(state).length === 0;
	}
	return withDeliveryValidation(state).length === 0;
};

const withDeliveryFormIsValid = (state: SubscriptionsState) =>
	withDeliveryValidation(state).length === 0;

export {
	validateWithDeliveryForm,
	validateCheckoutForm,
	checkoutFormIsValid,
	withDeliveryFormIsValid,
};
