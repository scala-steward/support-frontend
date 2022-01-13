import { css } from '@emotion/core';
import { Button, buttonReaderRevenueBrandAlt } from '@guardian/src-button';
import { space } from '@guardian/src-foundations';
import { textSans } from '@guardian/src-foundations/typography';
import { TextInput } from '@guardian/src-text-input';
import { ThemeProvider } from 'emotion-theming';
import React from 'react';
import CheckoutExpander from 'components/checkoutExpander/checkoutExpander';
import { emailRegexPattern } from 'helpers/forms/formValidation';
import { firstError } from 'helpers/subscriptionsForms/validation';
import type { PersonalDetailsUIProps } from './controller';

const marginBottom = css`
	margin-bottom: ${space[6]}px;
`;

const sansText = css`
	${textSans.medium()};
`;

const paragraphWithButton = css`
	margin-top: ${space[2]}px;
	${textSans.medium()};
`;

function SignedInEmailFooter(props: {
	handleSignOut: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
	return (
		<div css={marginBottom}>
			<CheckoutExpander copy="Want to use a different email address?">
				<p css={sansText}>
					You will be able to edit this in your account once you have completed
					this checkout.
				</p>
			</CheckoutExpander>
			<CheckoutExpander copy="Not you?">
				<p css={paragraphWithButton}>
					<ThemeProvider theme={buttonReaderRevenueBrandAlt}>
						<Button
							type="button"
							onClick={props.handleSignOut}
							priority="tertiary"
							size="small"
						>
							Sign out
						</Button>{' '}
						and create a new account.
					</ThemeProvider>
				</p>
			</CheckoutExpander>
		</div>
	);
}

function SignedOutEmailFooter() {
	return <div css={marginBottom} />;
}

export default function PersonalDetailsUI(
	props: PersonalDetailsUIProps,
): JSX.Element {
	return (
		<div id="qa-personal-details">
			<TextInput
				css={marginBottom}
				id="first-name"
				label="First name"
				type="text"
				value={props.firstName}
				onChange={props.setFirstName}
				error={firstError('firstName', props.formErrors)}
			/>
			<TextInput
				css={marginBottom}
				id="last-name"
				label="Last name"
				type="text"
				value={props.lastName}
				onChange={props.setLastName}
				error={firstError('lastName', props.formErrors)}
			/>
			<TextInput
				css={marginBottom}
				label="Email"
				type="email"
				value={props.email}
				onChange={props.setEmail}
				onBlur={props.fetchAndStoreUserType}
				error={firstError('email', props.formErrors)}
				pattern={emailRegexPattern}
				disabled={props.isSignedIn}
			/>
			{props.isSignedIn && (
				<TextInput
					label="Confirm email"
					type="email"
					value={props.confirmEmail}
					onChange={props.setConfirmEmail}
					error={firstError('confirmEmail', props.formErrors)}
					pattern={emailRegexPattern}
				/>
			)}
			{props.isSignedIn ? (
				<SignedInEmailFooter handleSignOut={props.signOut} />
			) : (
				<SignedOutEmailFooter />
			)}
			<TextInput
				id="telephone"
				label="Telephone"
				optional
				type="tel"
				value={props.telephone}
				onChange={props.setTelephone}
				supporting="We may use this to get in touch with you about your subscription."
				error={firstError('telephone', props.formErrors)}
			/>
		</div>
	);
}
