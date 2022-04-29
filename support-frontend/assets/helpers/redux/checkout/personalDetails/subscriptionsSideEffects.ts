import type { AnyAction } from '@reduxjs/toolkit';
import { isAnyOf } from '@reduxjs/toolkit';
import type { SubscriptionsStartListening } from 'helpers/redux/subscriptionsStore';
import { enableOrDisableForm } from 'helpers/subscriptionsForms/checkoutFormIsSubmittableActions';
import type { FormField } from 'helpers/subscriptionsForms/formFields';
import type { AnyCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { removeError } from 'helpers/subscriptionsForms/validation';
import {
	setConfirmEmail,
	setEmail,
	setFirstName,
	setLastName,
	setUserTypeFromIdentityResponse,
} from './actions';

export function removeErrorsForField(
	fieldName: FormField,
	state: AnyCheckoutState,
): AnyAction {
	return {
		type: 'SET_FORM_ERRORS',
		errors: removeError(fieldName, state.page.checkout.formErrors),
	};
}

const shouldCheckFormEnabled = isAnyOf(
	setConfirmEmail,
	setEmail,
	setFirstName,
	setLastName,
	setUserTypeFromIdentityResponse,
);

const actionCreatorFieldNames: Record<string, FormField> = {
	[setConfirmEmail.type]: 'confirmEmail',
	[setEmail.type]: 'email',
	[setFirstName.type]: 'firstName',
	[setLastName.type]: 'lastName',
};

export function addPersonalDetailsSideEffects(
	startListening: SubscriptionsStartListening,
): void {
	startListening({
		matcher: shouldCheckFormEnabled,
		effect(action, listenerApi) {
			if (!setUserTypeFromIdentityResponse.match(action)) {
				listenerApi.dispatch(
					removeErrorsForField(
						actionCreatorFieldNames[action.type],
						listenerApi.getState(),
					),
				);
			}

			listenerApi.dispatch(enableOrDisableForm());
		},
	});
}
