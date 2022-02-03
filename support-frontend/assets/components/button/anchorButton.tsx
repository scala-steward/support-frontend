// ----- Imports ----- //
import React from 'react';
import type { SharedButtonPropTypes } from './_sharedButton';
import SharedButton, { defaultProps } from './_sharedButton';
import './button.scss';
// ----- Render ----- //
export type PropTypes = SharedButtonPropTypes & {
	'aria-label'?: string | null | undefined;
	href: string;
};

function AnchorButton(props: PropTypes) {
	return <SharedButton element="a" {...props} />;
}

AnchorButton.defaultProps = { ...defaultProps, 'aria-label': null };
export default AnchorButton;
