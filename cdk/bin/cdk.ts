import "source-map-support/register";
import { App } from "@aws-cdk/core";
import { Frontend } from "../lib/frontend";
import { StripePatronsData } from "../lib/stripe-patrons-data";

const app = new App();
const cloudFormationStackName = process.env.GU_CFN_STACK_NAME;

new Frontend(app, "Frontend-PROD", {
  stack: "support",
  stage: "PROD",
  cloudFormationStackName,
  membershipSubPromotionsTable:
    "arn:aws:dynamodb:*:*:table/MembershipSub-Promotions-PROD",
  redemptionCodesTable: "arn:aws:dynamodb:*:*:table/redemption-codes-PROD",
  domainName: "support.theguardian.com.origin.membership.guardianapis.com",
  scaling: {
    minimumInstances: 3,
    maximumInstances: 6,
  },
  shouldEnableAlarms: true,
});

new Frontend(app, "Frontend-CODE", {
  stack: "support",
  stage: "CODE",
  cloudFormationStackName,
  membershipSubPromotionsTable:
    "arn:aws:dynamodb:*:*:table/MembershipSub-Promotions-DEV",
  redemptionCodesTable: "arn:aws:dynamodb:*:*:table/redemption-codes-DEV",
  domainName: "support.code.theguardian.com.origin.membership.guardianapis.com",
  scaling: {
    minimumInstances: 1,
    maximumInstances: 2,
  },
  shouldEnableAlarms: false,
});

new StripePatronsData(app, "StripePatronsData-CODE", {
  stack: "support",
  stage: "CODE",
  cloudFormationStackName,
});

new StripePatronsData(app, "StripePatronsData-PROD", {
  stack: "support",
  stage: "PROD",
  cloudFormationStackName,
});
