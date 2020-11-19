// @flow

import type { ContributionTypes } from 'helpers/contributions';
import type { TickerSettings } from 'components/ticker/contributionTicker';

type CampaignCopy = {
  headerCopy?: string | React$Element<string>,
  contributeCopy?: string | React$Element<string>,
};

export type CampaignSettings = {
  campaignCode: string,
  copy?: (goalReached: boolean) => CampaignCopy,
  formMessage?: React$Element<string>,
  termsAndConditions?: (contributionsTermsLink: string, contactEmail: string) => React$Element<string>,
  cssModifiers?: string[],
  contributionTypes?: ContributionTypes,
  backgroundImage?: string,
  extraComponent?: React$Element<string>,
  tickerSettings?: TickerSettings,
  goalReachedCopy?: React$Element<string>, // If set, the form will be replaced with this if goal reached
  createReferralCodes: boolean,
};

const currentCampaignPath: string | null = 'us/contribute';

export const campaign: CampaignSettings = ({
  campaignCode: 'us_eoyappeal_2020',
  tickerSettings: {
    tickerCountType: 'money',
    tickerEndType: 'unlimited',
    currencySymbol: '$',
    copy: {
      countLabel: 'contributions',
      goalReachedPrimary: 'We\'ve hit our goal!',
      goalReachedSecondary: 'but you can still support us',
    },
  },
  createReferralCodes: false,
});

function campaignEnabledForUser(campaignCode: ?string): boolean {
  if (currentCampaignPath && window.guardian.enableContributionsCampaign) {
    return window.guardian.forceContributionsCampaign ||
      window.location.pathname.endsWith(`/${currentCampaignPath}`) ||
      campaign.campaignCode === campaignCode;
  }
  return false;
}

export function getCampaignSettings(campaignCode: ?string): CampaignSettings | null {
  if (campaignEnabledForUser(campaignCode)) {
    return campaign;
  }
  return null;
}

export function getCampaignCode(campaignCode?: string): string | null {
  const campaignSettings = getCampaignSettings(campaignCode);
  if (campaignSettings) {
    return campaignSettings.campaignCode;
  }
  return null;
}
