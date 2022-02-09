// ----- Imports ----- //
import { css, ThemeProvider } from '@emotion/react';
import { from, headline, space, textSans } from '@guardian/source-foundations';
import {
	buttonThemeReaderRevenue,
	LinkButton,
	SvgArrowRightStraight,
} from '@guardian/source-react-components';
import Content from 'components/content/contentSimple';

const subHeading = css`
	margin-bottom: ${space[1]}px;
	${headline.xxsmall({
		fontWeight: 'bold',
		lineHeight: 'loose',
	})};
`;
const sansText = css`
	${textSans.medium({
		lineHeight: 'regular',
	})}
	${from.desktop} {
		${textSans.medium({
			lineHeight: 'loose',
		})}
	}
`;
const maxWidth = css`
	${from.tablet} {
		max-width: 70%;
	}

	${from.leftCol} {
		max-width: 60%;
	}
`;
const marginForButton = css`
	margin: ${space[5]}px 0 0;
`;

function SubscriptionsSurvey() {
	const surveyLink = 'https://www.surveymonkey.co.uk/r/Q37XNTV';
	const title = 'Tell us about your subscription';
	const message =
		'Please take this short survey to tell us why you purchased your subscription.';
	return surveyLink ? (
		<Content>
			<section css={maxWidth}>
				<h3 css={subHeading}>{title}</h3>
				<p css={sansText}>{message}</p>
				<ThemeProvider theme={buttonThemeReaderRevenue}>
					<LinkButton
						css={marginForButton}
						href={surveyLink}
						priority="tertiary"
						icon={<SvgArrowRightStraight />}
						iconSide="right"
						nudgeIcon
						aria-label="Link to subscription survey"
						target="_blank"
						rel="noopener noreferrer"
					>
						Share your thoughts
					</LinkButton>
				</ThemeProvider>
			</section>
		</Content>
	) : null;
}

export default SubscriptionsSurvey;
