import type React from 'react';
import type { FormField } from 'helpers/subscriptionsForms/formFields';
import type { FormError } from 'helpers/subscriptionsForms/validation';

export type PersonalDetailsUIProps = {
	firstName: string;
	setFirstName: (e: React.ChangeEvent<HTMLInputElement>) => void;
	lastName: string;
	setLastName: (e: React.ChangeEvent<HTMLInputElement>) => void;
	email: string;
	setEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
	confirmEmail?: string;
	setConfirmEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
	fetchAndStoreUserType: (e: React.FocusEvent<HTMLInputElement>) => void;
	telephone?: string;
	setTelephone: (e: React.ChangeEvent<HTMLInputElement>) => void;
	formErrors: Array<FormError<FormField>>;
	isSignedIn: boolean;
	signOut: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export type PersonalDetailsControllerProps = {
	firstName: string;
	setFirstName: (value: string) => void;
	lastName: string;
	setLastName: (value: string) => void;
	email: string;
	setEmail: (value: string) => void;
	confirmEmail?: string;
	setConfirmEmail?: (value: string) => void;
	fetchAndStoreUserType?: (value: string) => void;
	isSignedIn: boolean;
	telephone?: string;
	setTelephone: (value: string) => void;
	formErrors: Array<FormError<FormField>>;
	signOut: () => void;
	render: (renderProps: PersonalDetailsUIProps) => JSX.Element;
};

export default function PersonalDetailsController(
	props: PersonalDetailsControllerProps,
): JSX.Element {
	const signOut = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		props.signOut();
	};

	const fetchAndStoreUserType = (e: React.FocusEvent<HTMLInputElement>) => {
		props.fetchAndStoreUserType?.(e.target.value);
	};

	const setEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
		props.setEmail(e.target.value);
	};

	const setConfirmEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
		props.setConfirmEmail?.(e.target.value);
	};

	const setFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
		props.setFirstName(e.target.value);
	};

	const setLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
		props.setLastName(e.target.value);
	};

	const setTelephone = (e: React.ChangeEvent<HTMLInputElement>) => {
		props.setTelephone(e.target.value);
	};

	return props.render({
		firstName: props.firstName,
		setFirstName,
		lastName: props.lastName,
		setLastName,
		email: props.email,
		setEmail,
		confirmEmail: props.confirmEmail,
		setConfirmEmail,
		fetchAndStoreUserType,
		telephone: props.telephone,
		setTelephone,
		formErrors: props.formErrors,
		isSignedIn: props.isSignedIn,
		signOut,
	});
}
