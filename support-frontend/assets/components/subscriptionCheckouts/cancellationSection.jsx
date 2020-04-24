// @flow
import React from 'react';
import { FormSection } from 'components/checkoutForm/checkoutForm';
import { type Option } from 'helpers/types/option';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { DirectDebit } from 'helpers/paymentMethods';
import DirectDebitTerms from 'components/subscriptionCheckouts/directDebitTerms';

export default function CancellationSection(props: {
  paymentMethod: Option<PaymentMethod>,
}) {
  return (
    <FormSection>
      {(props.paymentMethod === DirectDebit) && <DirectDebitTerms />}
    </FormSection>
  );
}
