import { css } from '@emotion/react';
import {
	between,
	body,
	brandAlt,
	from,
	headline,
	neutral,
	space,
	textSans,
	until,
} from '@guardian/source-foundations';

export const wrapper = css`
	background-color: ${neutral[100]};
	color: ${neutral[7]};
	${until.desktop} {
		padding: ${space[3]}px;
	}
	${until.tablet} {
		box-shadow: 0 4px 4px ${neutral[86]};
	}
`;

export const topLine = css`
	display: flex;
	justify-content: space-between;
	width: calc(100%-${space[3]}px * 2);
	align-items: center;
	padding: ${space[3]}px;

	${until.desktop} {
		border-top: 1px solid ${neutral['93']};
		padding: ${space[1]}px 0 ${space[2]}px;
	}

	a,
	a:visited {
		display: block;
		${textSans.small()};
		color: ${neutral[7]};
		${from.desktop} {
			${textSans.medium({
				fontWeight: 'bold',
			})};
		}
	}

	${between.phablet.and.desktop} {
		display: block;
	}
`;

export const sansTitle = css`
	${textSans.medium({
		fontWeight: 'bold',
	})};
	${from.phablet} {
		${textSans.large({
			fontWeight: 'bold',
		})};
	}
`;

export const contentBlock = css`
	display: flex;
	width: 100%;

	${from.tablet} {
		display: block;
	}
`;

export const imageContainer = css`
	display: inline-flex;
	align-items: flex-start;
	width: 100%;
	padding: ${space[4]}px ${space[3]}px 0;
	background-color: ${neutral['97']};

	img {
		width: 100%;
		height: auto;
	}

	${until.tablet} {
		width: 65px;
		height: 73px;
		padding-top: 8px;
		padding-left: 8px;
		overflow: hidden;
		img {
			width: 200%;
			align-items: flex-end;
		}
	}
`;

export const textBlock = css`
	margin-left: ${space[3]}px;

	${from.desktop} {
		display: flex;
		justify-content: space-between;
		width: calc(100%-${space[3]}px * 2);
		margin: ${space[3]}px;
		align-items: baseline;
	}

	h3 {
		${body.medium({
			fontWeight: 'bold',
		})};
		margin: -5px 0 -3px;
		${from.desktop} {
			${headline.xxsmall({
				fontWeight: 'bold',
			})};
			margin-top: 0;
		}
	}
	p,
	span {
		max-width: 240px;
	}
	span {
		background-color: ${brandAlt[400]};
		padding: 2px;
		${textSans.small({
			fontWeight: 'bold',
		})};
		${from.desktop} {
			padding: ${space[1]}px;
			${textSans.medium()};
		}
	}
	p {
		${body.small({
			fontWeight: 'regular',
		})};
		line-height: 135%;
		${from.desktop} {
			display: none;
		}
	}
`;

export const endSummary = css`
	display: none;

	${from.desktop} {
		display: block;
	}
`;
