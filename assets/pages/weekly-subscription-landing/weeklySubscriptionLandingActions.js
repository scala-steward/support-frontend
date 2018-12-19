// @flow

// ----- Imports ----- //

import { type WeeklyBillingPeriod } from 'helpers/subscriptions';
import { getWeeklyCheckout } from 'helpers/externalLinks';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { ProductPagePlanFormActionsFor } from 'components/productPage/productPagePlanForm/productPagePlanFormActions';

import { type State } from './weeklySubscriptionLandingReducer';

// ----- Action Creators ----- //

const { setPlan } = ProductPagePlanFormActionsFor<WeeklyBillingPeriod>('GuardianWeekly', 'GuardianWeekly');

function redirectToWeeklyPage() {
  return (dispatch: Function, getState: () => State) => {
    const state = getState();
    const { countryGroupId } = state.common.internationalisation;
    const { referrerAcquisitionData, abParticipations, optimizeExperiments } = state.common;
    const location = state.page.plan ? getWeeklyCheckout(
      referrerAcquisitionData,
      state.page.plan,
      countryGroupId,
      abParticipations,
      optimizeExperiments,
      (state.page.plan === 'year' ? '10ANNUAL' : undefined),
    ) : null;

    if (location) {
      sendTrackingEventsOnClick('main_cta_click', 'GuardianWeekly', null)();
      window.location.href = location;
    }
  };
}


// ----- Exports ----- //

export { setPlan, redirectToWeeklyPage };
