// ----- Imports ----- //
import type { ReactElement, ReactNode } from 'react';
import React from 'react';
import type { Option } from 'helpers/types/option';
import './label.scss';

// ----- Types ----- //
export type PropsForHoc = {
	label: string;
	optional?: boolean;
	footer?: ReactNode;
	labelId?: string;
};
type Props = PropsForHoc & {
	htmlFor: Option<string>;
	children: ReactNode;
};

// ----- Component ----- //
function Label({
	label,
	children,
	footer,
	htmlFor,
	optional,
	labelId,
}: Props): ReactElement {
	const Element = htmlFor ? 'label' : 'strong';
	return (
		<div className="component-form-label">
			<Element
				className="component-form-label__label"
				id={labelId}
				htmlFor={htmlFor ? htmlFor : undefined}
			>
				{label}
				{optional && (
					<span className="component-form-label__note">Optional</span>
				)}
			</Element>
			{children}
			{footer && <div className="component-form-label__footer">{footer}</div>}
		</div>
	);
}

Label.defaultProps = {
	footer: null,
	optional: false,
	labelId: '',
};
// ----- Exports ----- //
export { Label };
