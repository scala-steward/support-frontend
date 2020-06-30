// @flow
import React, { Component } from 'react';
import { getTrackingConsent, writeTrackingConsentCookie, type ThirdPartyTrackingConsent } from '../../helpers/tracking/thirdPartyTrackingConsent';
import {
  OptedIn,
  Unset,
} from '../../helpers/tracking/thirdPartyTrackingConsent';
import Roundel from './roundel.svg';
import Tick from './tick.svg';
import Button from 'components/button/button';
import Text from 'components/text/text';
import styles from 'components/consentBanner/consentBanner.module.scss';
import { isPostDeployUser } from 'helpers/user/user';
import { ccpaEnabled } from 'helpers/tracking/ccpa';

type StateTypes = {
  showBanner: boolean,
}

class ConsentBanner extends Component<{}, StateTypes> {
  constructor() {
    super();
    this.state = {
      showBanner: false,
    };
  }

  componentDidMount() {
    getTrackingConsent().then((trackingConsent: ThirdPartyTrackingConsent) => {
      this.setState({ showBanner: trackingConsent === Unset });
    });
  }

  render() {
    const { showBanner } = this.state;

    if (!ccpaEnabled() && showBanner && !isPostDeployUser()) {
      return (
        <div className={styles.root}>
          <div className={styles.copy}>
            <Roundel className={styles.roundel} />
            <Text className={styles.text} title="Your privacy">
              <p>We use cookies to improve your experience on our site and to show you personalised advertising.</p>
              <p>To find out more, read our&nbsp;
                <a
                  href="https://www.theguardian.com/help/privacy-policy"
                >
                privacy policy
                </a>&nbsp;and&nbsp;
                <a
                  href="https://www.theguardian.com/info/cookies"
                >
                cookie policy
                </a>.
              </p>
            </Text>
            <div className={styles.actions}>
              <Button
                icon={<Tick />}
                iconSide="left"
                onClick={() => {
                  writeTrackingConsentCookie(OptedIn);
                  this.setState({ showBanner: false });
                }}
              >
              I&#39;m OK with that
              </Button>
              <a
                href="https://profile.theguardian.com/privacy-settings"
              >
              My options
              </a>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }
}

export default ConsentBanner;
