import { stateProvinceFieldFromString } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { UserActions } from 'helpers/user/userReducer';
import { userActions } from 'helpers/user/userReducer';
import { setFormSubmissionDependentValue } from './checkoutFormIsSubmittableActions';

// ----- Actions Creators ----- //
const setIsSignedIn =
	(isSignedIn: boolean): ((arg0: (...args: any[]) => any) => void) =>
	(dispatch: (...args: any[]) => any): void => {
		dispatch(
			setFormSubmissionDependentValue(() => ({
				type: 'SET_IS_SIGNED_IN',
				isSignedIn,
			})),
		);
	};

const setIsRecurringContributor =
	(): ((arg0: (...args: any[]) => any) => void) =>
	(dispatch: (...args: any[]) => any): void => {
		dispatch(
			setFormSubmissionDependentValue(() => ({
				type: 'SET_IS_RECURRING_CONTRIBUTOR',
			})),
		);
	};

const setStateFieldSafely =
	(pageCountryGroupId: CountryGroupId) =>
	(unsafeState: string): ((arg0: (...args: any[]) => any) => void) =>
	(dispatch: (...args: any[]) => any): void => {
		const stateField = stateProvinceFieldFromString(
			pageCountryGroupId,
			unsafeState,
		);

		if (stateField) {
			dispatch(
				setFormSubmissionDependentValue(() => ({
					type: 'user/setStateField',
					payload: stateField,
				})),
			);
		}
	};

const setUserStateActions = (countryGroupId: CountryGroupId): UserActions => {
	const setStateField = setStateFieldSafely(countryGroupId);
	return {
		...userActions,
		setIsSignedIn,
		setIsRecurringContributor,
		setStateField,
	};
};

export { setUserStateActions };
