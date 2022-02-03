// ----- Imports ----- //
import { css } from '@emotion/react';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { neutral } from '@guardian/src-foundations/palette';
import { body } from '@guardian/src-foundations/typography';
import { Link } from '@guardian/src-link';
import React from 'react';
import type { Node } from 'react';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { paperSubsUrl } from 'helpers/urls/routes';

const linkColor = css`
	color: inherit;
`;

const linkStyles = (tab, activeTab) => css`
	color: ${neutral[100]};
	${body.small({
		fontWeight: 'bold',
	})};
	text-decoration: none;
	padding: ${space[3]}px ${space[3]}px ${space[2]}px;
	border-bottom: ${space[1]}px solid
		${tab === activeTab ? neutral[100] : 'transparent'};
	width: 50%;
	${from.tablet} {
		width: initial;
	}
`;

function LinkTo({
	setTabAction,
	tab,
	children,
	activeTab,
	isPricesTabLink,
}: {
	setTabAction: (arg0: PaperFulfilmentOptions) => void;
	tab: PaperFulfilmentOptions;
	children: Node;
	activeTab?: PaperFulfilmentOptions | null;
	isPricesTabLink?: boolean;
}) {
	return (
		<Link
			css={isPricesTabLink ? linkStyles(tab, activeTab) : linkColor}
			href={paperSubsUrl(tab === 'delivery')}
			aria-current={tab === activeTab}
			onClick={(ev) => {
				ev.preventDefault();
				setTabAction(tab);
			}}
		>
			{children}
		</Link>
	);
}

LinkTo.defaultProps = {
	activeTab: null,
	isPricesTabLink: false,
};
export default LinkTo;
