// ----- Imports ----- //
import { fetchJson, getRequestOptions } from 'helpers/async/fetch';
import { logPromise } from 'helpers/async/promise';
import { checkEmail } from 'helpers/forms/formValidation';
import { routes } from 'helpers/urls/routes';
import type { CsrfState } from './redux/checkout/csrf/state';

// ----- Types     ----- //
type UserType = 'new' | 'guest' | 'current';

type UserTypeResponse = { userType: UserType };

export type UserTypeFromIdentityResponse =
	| UserType
	| 'noRequestSent'
	| 'requestPending'
	| 'requestFailed';

// ----- Functions ----- //
async function sendGetUserTypeFromIdentityRequest(
	email: string,
	csrf: CsrfState,
	setUserTypeFromIdentityResponse: (arg0: UserTypeFromIdentityResponse) => void,
): Promise<UserTypeFromIdentityResponse> {
	const resp = (await fetchJson(
		`${routes.getUserType}?maybeEmail=${encodeURIComponent(email)}`,
		getRequestOptions('same-origin', csrf),
	)) as UserTypeResponse;

	if (typeof resp.userType !== 'string') {
		throw new Error('userType string was not present in response');
	}
	setUserTypeFromIdentityResponse(resp.userType);
	return resp.userType;
}

function getUserTypeFromIdentity(
	email: string,
	isSignedIn: boolean,
	csrf: CsrfState,
	setUserTypeFromIdentityResponse: (arg0: UserTypeFromIdentityResponse) => void,
): Promise<UserTypeFromIdentityResponse> {
	if (isSignedIn || !checkEmail(email)) {
		setUserTypeFromIdentityResponse('noRequestSent');
		return Promise.resolve('noRequestSent');
	}

	setUserTypeFromIdentityResponse('requestPending');
	return logPromise(
		sendGetUserTypeFromIdentityRequest(
			email,
			csrf,
			setUserTypeFromIdentityResponse,
		),
	).catch(() => {
		setUserTypeFromIdentityResponse('requestFailed');
		return 'requestFailed';
	});
}

export { getUserTypeFromIdentity };
