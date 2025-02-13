// ----- Imports ----- //
import { css } from '@emotion/react';
import { brand, from, space } from '@guardian/source-foundations';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import DirectDebitPopUpForm from 'components/directDebit/directDebitPopUpForm/directDebitPopUpForm';
import ProgressMessage from 'components/progressMessage/progressMessage';
import SecureTransactionIndicator from 'components/secureTransactionIndicator/secureTransactionIndicator';
import ContributionTicker from 'components/ticker/contributionTicker';
import { isInSupportAgainHeaderVariant } from 'helpers/abTests/lpPreviousGiving';
import { getCampaignSettings } from 'helpers/campaigns/campaigns';
import { getAmount } from 'helpers/contributions';
import type {
	ContributionType,
	OtherAmounts,
	SelectedAmounts,
} from 'helpers/contributions';
import { useLastOneOffContribution } from 'helpers/customHooks/useLastOneOffContribution';
import type { PaymentAuthorisation } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import { sendEventContributionCheckoutConversion } from 'helpers/tracking/quantumMetric';
import {
	onThirdPartyPaymentAuthorised,
	paymentWaiting,
	setTickerGoalReached,
} from '../contributionsLandingActions';
import type { State } from '../contributionsLandingReducer';
import ContributionForm from './ContributionForm';
import { ContributionFormBlurb } from './ContributionFormBlurb';
import {
	PreviousGivingBodyCopy,
	PreviousGivingHeaderCopy,
} from './ContributionsFormBlurbPreviousGiving';
import { ContributionsFormJournalismHighlights } from './ContributionsFormJournalismHighlights';
import LiveFeedBack from './DigiSubBenefits/LiveFeedBack';
import LiveFeedBackProvider from './DigiSubBenefits/LiveFeedBackProvider';

// ----- Types ----- //

type PropTypes = {
	paymentComplete: boolean;
	countryGroupId: CountryGroupId;
	thankYouRoute: string;
	setPaymentIsWaiting: (arg0: boolean) => void;
	onThirdPartyPaymentAuthorised: (arg0: PaymentAuthorisation) => void;
	setTickerGoalReached: () => void;
	tickerGoalReached: boolean;
	campaignCodeParameter: string | null | undefined;
	isReturningContributor: boolean;
	countryId: IsoCountry;
	userName: string | null;
	referrerAcquisitionData: ReferrerAcquisitionData;
	currency: IsoCurrency;
	shouldShowRichLandingPage: boolean;
	isSignedIn: boolean;
	contributionType: ContributionType;
	otherAmounts: OtherAmounts;
	selectedAmounts: SelectedAmounts;
};

const mapStateToProps = (state: State) => ({
	paymentComplete: state.page.form.paymentComplete,
	countryGroupId: state.common.internationalisation.countryGroupId,
	tickerGoalReached: state.page.form.tickerGoalReached,
	isReturningContributor: state.page.user.isReturningContributor,
	countryId: state.common.internationalisation.countryId,
	userName: state.page.user.firstName,
	referrerAcquisitionData: state.common.referrerAcquisitionData,
	currency: state.common.internationalisation.currencyId,
	shouldShowRichLandingPage: false,
	isSignedIn: state.page.user.isSignedIn,
	contributionType: getContributionType(state),
	otherAmounts: state.page.checkoutForm.product.otherAmounts,
	selectedAmounts: state.page.checkoutForm.product.selectedAmounts,
});

const mapDispatchToProps = {
	setPaymentIsWaiting: paymentWaiting,
	setTickerGoalReached,
	onThirdPartyPaymentAuthorised,
};

// ----- Styles ----- //

const styles = {
	container: css`
		width: 100%;
	`,
	richLandingPageContainer: css`
		background-color: ${brand[800]};
	`,
	contentContainer: css`
		display: flex;
		flex-direction: column;
		justify-content: flex-start;

		${from.tablet} {
			flex-direction: row;
			max-width: none;
		}

		${from.desktop} {
			max-width: 980px;
		}

		${from.leftCol} {
			max-width: 1140px;
		}

		${from.wide} {
			max-width: 1300px;
		}
	`,
	stickyFormContainer: css`
		${from.tablet} {
			position: sticky;
			top: 0;
			height: 100vh;
			overflow: auto;
			box-sizing: border-box;
			max-width: none !important;
			width: 420px;
			flex-shrink: 0;
		}

		${from.leftCol} {
			width: 520px;
		}
	`,
	innerFormContainer: css`
		position: relative;
	`,
	highlightsContainer: css`
		padding-top: ${space[2]}px;
		padding-bottom: ${space[3]}px;

		${from.tablet} {
			padding-left: ${space[2]}px;
		}

		${from.desktop} {
			padding-left: ${space[9]}px;
			padding-right: ${space[5]}px;
		}

		${from.leftCol} {
			padding-left: 60px;
			padding-right: 50px;
			padding-bottom: ${space[9]}px;
		}

		${from.wide} {
			padding-left: 50px;
			padding-right: 20px;
			padding-bottom: ${space[12]}px;
		}
	`,
};

// ----- Functions ----- //
export type CountryMetaData = {
	headerCopy: string;
	contributeCopy?: JSX.Element;
	// Optional message to display at the top of the form
	formMessage?: JSX.Element;
};
const defaultHeaderCopy =
	'Support\xa0our\njournalism\xa0with\na\xa0contribution\nof\xa0any\xa0size';
const defaultContributeCopy = (
	<span>
		Your support helps protect the Guardian’s independence and it means we can
		keep delivering quality journalism that’s open for everyone around the
		world.
		<span className="gu-content__blurb-blurb-last-sentence">
			{' '}
			Every contribution, however big or small, is so valuable for our future.
		</span>
	</span>
);

const defaultHeaderCopyAndContributeCopy: CountryMetaData = {
	headerCopy: defaultHeaderCopy,
	contributeCopy: defaultContributeCopy,
};
// ----- Render ----- //

function withProps(props: PropTypes) {
	const campaignSettings = getCampaignSettings();
	const campaignCopy = campaignSettings?.copy
		? campaignSettings.copy(props.tickerGoalReached)
		: null;

	const onPaymentAuthorisation = (
		paymentAuthorisation: PaymentAuthorisation,
	) => {
		props.setPaymentIsWaiting(true);
		props.onThirdPartyPaymentAuthorised(paymentAuthorisation);
	};

	const countryGroupDetails = {
		...defaultHeaderCopyAndContributeCopy,
		...(campaignCopy ?? {}),
	};

	if (props.paymentComplete) {
		const {
			contributionType,
			selectedAmounts,
			otherAmounts,
			currency,
			thankYouRoute,
		} = props;
		const amount = getAmount(selectedAmounts, otherAmounts, contributionType);

		sendEventContributionCheckoutConversion(amount, contributionType, currency);

		// We deliberately allow the redirect to REPLACE rather than PUSH /thankyou onto the history stack.
		// This is because going 'back' to the /contribute page is not helpful, and the client-side routing would redirect
		// back to /thankyou given the current state of the redux store.
		// The effect is that clicking back in the browser will take the user to the page before they arrived at /contribute
		return <Navigate to={thankYouRoute} replace />;
	}

	if (props.campaignCodeParameter && !campaignSettings) {
		// A campaign code was supplied in the url path, but it's not a valid campaign
		return (
			<Navigate
				to={`/${
					countryGroups[props.countryGroupId].supportInternationalisationId
				}/contribute`}
				replace
			/>
		);
	}

	const showPreviousGiving = isInSupportAgainHeaderVariant(
		props.referrerAcquisitionData,
	);
	const lastOneOffContribution = useLastOneOffContribution(props.isSignedIn);

	return (
		<div
			css={[
				styles.container,
				...(props.shouldShowRichLandingPage
					? [styles.richLandingPageContainer]
					: []),
			]}
		>
			<div
				css={styles.contentContainer}
				className="gu-content__content-contributions gu-content__content--flex"
			>
				<div
					className="gu-content__form"
					css={[
						...(props.shouldShowRichLandingPage
							? [styles.stickyFormContainer]
							: []),
					]}
				>
					{campaignSettings?.tickerSettings ? (
						<ContributionTicker
							{...campaignSettings.tickerSettings}
							onGoalReached={props.setTickerGoalReached}
						/>
					) : null}

					<LiveFeedBackProvider>
						<div css={styles.innerFormContainer}>
							<LiveFeedBack
								contributionType={props.contributionType}
								countryGroupId={props.countryGroupId}
							/>

							<SecureTransactionIndicator modifierClasses={['top']} />

							{props.tickerGoalReached &&
							campaignSettings &&
							campaignSettings.tickerSettings &&
							campaignSettings.goalReachedCopy ? (
								campaignSettings.goalReachedCopy
							) : (
								<div>
									{countryGroupDetails.formMessage ? (
										<div className="form-message">
											{countryGroupDetails.formMessage}
										</div>
									) : null}

									<ContributionForm
										onPaymentAuthorisation={onPaymentAuthorisation}
										campaignSettings={campaignSettings}
									/>
								</div>
							)}
						</div>
					</LiveFeedBackProvider>
				</div>

				{props.shouldShowRichLandingPage ? (
					<div css={styles.highlightsContainer}>
						<ContributionsFormJournalismHighlights />
					</div>
				) : (
					<div>
						{showPreviousGiving && lastOneOffContribution ? (
							<ContributionFormBlurb
								headerCopy={
									<PreviousGivingHeaderCopy userName={props.userName} />
								}
								bodyCopy={
									<PreviousGivingBodyCopy
										lastOneOffContribution={lastOneOffContribution}
									/>
								}
							/>
						) : (
							<ContributionFormBlurb
								headerCopy={countryGroupDetails.headerCopy}
								bodyCopy={countryGroupDetails.contributeCopy}
							/>
						)}
					</div>
				)}

				{campaignSettings?.extraComponent}
				<DirectDebitPopUpForm
					buttonText="Contribute with Direct Debit"
					onPaymentAuthorisation={onPaymentAuthorisation}
				/>
			</div>
		</div>
	);
}

function withoutProps(): JSX.Element {
	return (
		<div className="gu-content__content gu-content__content-contributions gu-content__content--flex">
			<ContributionFormBlurb
				headerCopy={defaultHeaderCopy}
				bodyCopy={defaultContributeCopy}
			/>

			<div className="gu-content__form gu-content__form-ssr">
				<SecureTransactionIndicator modifierClasses={['top']} />
				<ProgressMessage message={['Loading the page']} />
			</div>
		</div>
	);
}

export const ContributionFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(withProps);
export const EmptyContributionFormContainer = withoutProps;
