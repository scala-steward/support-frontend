// ----- Imports ----- //
import type { ReactNode } from 'react';
import SvgExclamation from 'components/svgs/exclamation';

// ---- Types ----- //
type PropTypes = {
	showError?: boolean;
	message: string | null | undefined;
	svg?: ReactNode;
};

// ----- Component ----- //
export default function ErrorMessage(props: PropTypes): JSX.Element | null {
	if (props.showError && props.message) {
		return (
			<div className="component-error-message">
				{props.svg}
				<span className="component-error-message__message">
					{props.message}
				</span>
			</div>
		);
	}

	return null;
}

// ----- Default Props ----- //
ErrorMessage.defaultProps = {
	showError: true,
	svg: <SvgExclamation />,
};
