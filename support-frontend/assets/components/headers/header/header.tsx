// ----- Imports ----- //
import { Component } from 'react';
import SvgGuardianLogo from 'components/svgs/guardianLogo';
import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import Links from '../links/links';
import MobileMenuToggler from './mobileMenuToggler';
import Padlock from './padlock.svg';
import './header.scss';

export type PropTypes = {
	utility?: JSX.Element;
	countryGroupId: CountryGroupId;
	display?: 'navigation' | 'checkout' | 'guardianLogo' | void;
};
export type State = {
	fitsLinksInOneRow: boolean;
	fitsLinksAtAll: boolean;
	isTestUser: boolean | null | undefined;
};

// ----- Metrics ----- //
const getMenuStateMetrics = ({
	menuRef,
	logoRef,
	containerRef,
}: {
	menuRef: Element;
	logoRef: Element;
	containerRef: Element;
}): State => {
	const [logoLeft, menuWidth, containerLeft, containerWidth] = [
		logoRef.getBoundingClientRect().left,
		menuRef.getBoundingClientRect().width,
		containerRef.getBoundingClientRect().left,
		containerRef.getBoundingClientRect().width,
	];
	const fitsLinksAtAll = containerWidth - menuWidth > 0;
	const fitsLinksInOneRow =
		fitsLinksAtAll && logoLeft - containerLeft - menuWidth > 0;
	const isTestUser = getGlobal<boolean>('isTestUser');
	return {
		fitsLinksInOneRow,
		fitsLinksAtAll,
		isTestUser,
	};
};

// ----- Component ----- //

type TopNavPropTypes = {
	utility?: JSX.Element;
	getLogoRef: (arg0: Element | null | undefined) => void;
	display: 'navigation' | 'checkout' | 'guardianLogo' | void;
};

function TopNav({ display, getLogoRef, utility }: TopNavPropTypes) {
	return (
		<div className="component-header-topnav">
			<div className="component-header-topnav__utility">{utility}</div>
			{display === 'checkout' && (
				<div className="component-header-topnav__checkout">
					<div />
					<div className="component-header-topnav--checkout-text">
						<div className="component-header--padlock">
							<Padlock />
						</div>
						<h1>Checkout</h1>
					</div>
				</div>
			)}
			<div className="component-header-topnav-logo" ref={getLogoRef}>
				<a
					className="component-header-topnav-logo__graun"
					href="https://www.theguardian.com"
				>
					<div className="visually-hidden">Return to the Guardian</div>
					<SvgGuardianLogo />
				</a>
			</div>
		</div>
	);
}

export default class Header extends Component<PropTypes, State> {
	static defaultProps = {
		utility: null,
		display: 'navigation',
	};
	state = {
		fitsLinksInOneRow: false,
		fitsLinksAtAll: false,
		isTestUser: getGlobal<boolean>('isTestUser'),
	};

	componentDidMount(): void {
		const { menuRef, logoRef, containerRef } = this;
		if (
			this.props.display === 'navigation' &&
			menuRef &&
			logoRef &&
			containerRef
		) {
			this.observer = new window.ResizeObserver(() => {
				this.setState(
					getMenuStateMetrics({
						menuRef,
						logoRef,
						containerRef,
					}),
				);
			});

			this.observer.observe(menuRef);
			this.observer.observe(logoRef);
			this.observer.observe(containerRef);
		}
	}

	componentWillUnmount(): void {
		if (this.observer) {
			this.observer.disconnect();
		}
	}

	logoRef: Element | null | undefined;
	menuRef: Element | null | undefined;
	containerRef: Element | null | undefined;
	observer: ResizeObserver | null | undefined;

	render(): JSX.Element {
		const { utility, display, countryGroupId } = this.props;
		const { fitsLinksInOneRow, fitsLinksAtAll, isTestUser } = this.state;
		return (
			<header
				className={classNameWithModifiers('component-header', [
					fitsLinksInOneRow ? 'one-row' : null,
					display === 'navigation' ? 'display-navigation' : null,
					!fitsLinksAtAll ? 'display-veggie-burger' : null,
					display === 'checkout' ? 'display-checkout' : null,
				])}
			>
				{!!isTestUser && (
					<div className="test-user-banner">
						<span>You are a test user</span>
					</div>
				)}
				<div
					className="component-header__wrapper"
					ref={(el) => {
						this.containerRef = el;
					}}
				>
					<div className="component-header__row">
						<TopNav
							display={display}
							utility={
								display === 'navigation' && fitsLinksAtAll ? utility : undefined
							}
							getLogoRef={(el) => {
								this.logoRef = el;
							}}
						/>
						{display === 'navigation' && (
							<MobileMenuToggler
								links={
									<Links countryGroupId={countryGroupId} location="mobile" />
								}
								utility={utility}
							/>
						)}
					</div>
					{display === 'navigation' && (
						<div className="component-header__row">
							<Links
								countryGroupId={countryGroupId}
								location="desktop"
								getRef={(el) => {
									this.menuRef = el;
								}}
							/>
						</div>
					)}
					{display === 'checkout' && (
						<div className="component-header__row component-header-checkout--row">
							<div className="component-header--padlock">
								<Padlock />
							</div>
							<div>Checkout</div>
						</div>
					)}
				</div>
			</header>
		);
	}
}
