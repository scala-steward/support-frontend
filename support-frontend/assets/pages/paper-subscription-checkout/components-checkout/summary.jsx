// @flow

import React, { Component } from 'react';
import { hasDiscount, type Price, type Promotion } from 'helpers/productPrice/productPrices';
import type { BillingPeriod } from 'helpers/billingPeriods';
import styles from './summary.module.scss';
import { PriceLabel } from 'components/priceLabel/priceLabel';
import typeof GridImageType from 'components/gridImage/gridImage';
import { type GridImg } from 'components/gridImage/gridImage';
import SvgDropdownArrowUp from './dropdownArrowUp.svg';

// Types

export type DataListItem = {
  title: string,
  value: string,
}

type PropTypes = {|
  billingPeriod: BillingPeriod,
  changeSubscription: string,
  dataList: DataListItem[],
  description: ?string,
  image: $Call<GridImageType, GridImg>,
  productPrice: Price,
  promotion: ?Promotion,
  title: string,
|};

type StateTypes = {
  showDropDown: boolean,
}

// Helpers

const DataList = (props: { dataList: DataListItem[] }) => (
  <div className={styles.dataList}>
    {props.dataList.length > 0 &&
      <dl className={styles.data}>
        {props.dataList.map(item => [
          <dt>{item.title}</dt>,
          <dd>{item.value}</dd>,
            ])
        }
      </dl>
    }
  </div>
);


const PromotionDiscount = (props: { promotion: ?Promotion }) => (
  <span>
    {props.promotion && hasDiscount(props.promotion) &&
      <div className={styles.promo}>
        <strong className={styles.promoTitle}>
          {props.promotion.description}
        </strong>
        {' '}({props.promotion.promoCode})
      </div>
    }
  </span>
);


const ChangeSubscription = (props: { route: string }) => (
  <a className={styles.changeSub} href={props.route}>Change Subscription</a>
);


const DropDownButton = (props: { onClick: Function, showDropDown: boolean }) => (
  <button
    aria-hidden="true"
    className={styles.dropDown}
    onClick={props.onClick}
  >
    <span className={styles.spaceRight}>{props.showDropDown ? 'Hide details' : 'Show all details'}</span>
    <SvgDropdownArrowUp className={props.showDropDown ? styles.openState : styles.defaultState} />
  </button>
);


const TabletAndDesktop = (props: {
  billingPeriod: BillingPeriod,
  changeSubscription: string,
  dataList: DataListItem[],
  description: ?string,
  image: $Call<GridImageType, GridImg>,
  productPrice: Price,
  promotion: ?Promotion,
  title: string,
}) => (
  <span className={styles.tabletAndDesktop}>
    <div className={styles.img}>
      {props.image}
    </div>
    <div className={styles.content}>
      <h1 className={styles.header}>Order summary</h1>
      <header>
        <h2 className={styles.title} title={`your subscription is ${props.title}`}>{props.title}</h2>
        {props.description &&
          <h3 className={styles.titleDescription}>{props.description}</h3>
        }
      </header>
      <div>
        <PriceLabel
          className={styles.pricing}
          productPrice={props.productPrice}
          promotion={props.promotion}
          billingPeriod={props.billingPeriod}
        />
        <PromotionDiscount promotion={props.promotion} />
        <DataList dataList={props.dataList} />
      </div>
      <ChangeSubscription route={props.changeSubscription} />
    </div>
  </span>
);


const HideDropDown = (props: {
  billingPeriod: BillingPeriod,
  onClick: Function,
  productPrice: Price,
  promotion: ?Promotion,
  showDropDown: boolean,
  title: string,
}) => (
  <div className={styles.content}>
    <h1 className={styles.header}>Order summary</h1>
    <header>
      <h2 className={styles.title} title={`your subscription is ${props.title}`}>{props.title}</h2>
    </header>
    <DropDownButton showDropDown={props.showDropDown} onClick={props.onClick} />
    <div>
      <PriceLabel
        className={styles.pricing}
        productPrice={props.productPrice}
        promotion={props.promotion}
        billingPeriod={props.billingPeriod}
      />
      <span className={styles.pricing}>
        &nbsp;&ndash; Voucher booklet
      </span>
    </div>
  </div>
);


const ShowDropDown = (props: {
  billingPeriod: BillingPeriod,
  changeSubscription: string,
  deliveryMethod: string,
  description: ?string,
  onClick: Function,
  productPrice: Price,
  promotion: ?Promotion,
  showDropDown: boolean,
  title: string,
}) => (
  <div className={styles.contentWrapper}>
    <h1 className={styles.headerShowDetails}>Order summary</h1>
    <div className={styles.contentShowDetails}>
      <header>
        <h2 className={styles.titleLeftAlign} title={`your subscription is ${props.title}`}>{props.title}</h2>
      </header>
      <h3 className={styles.titleDescription}>{props.description}</h3>
    </div>
    <div className={styles.contentShowDetails}>
      <div className={styles.dataBold}>Payment plan</div>
      <PriceLabel
        className={styles.data}
        productPrice={props.productPrice}
        promotion={props.promotion}
        billingPeriod={props.billingPeriod}
      />
    </div>
    <div className={styles.contentShowDetails}>
      <div className={styles.dataBold}>Delivery method</div>
      <div className={styles.data}>{props.deliveryMethod}</div>
    </div>
    <div className={styles.contentShowDetailsLast}>
      <DropDownButton showDropDown={props.showDropDown} onClick={props.onClick} />
      <ChangeSubscription route={props.changeSubscription} />
    </div>
  </div>
);


const Mobile = props => (
  <span className={styles.mobileOnly}>
    {!props.showDropDown && <HideDropDown {...props} />}
    {props.showDropDown && <ShowDropDown {...props} />}
  </span>
);

// Main class

export default class Summary extends Component<PropTypes, StateTypes> {
  static defaultProps = {
    dataList: [],
  }

  constructor(props: PropTypes) {
    super(props);

    this.state = {
      showDropDown: false,
    };
  }

  getDeliveryMethod = () => this.props.dataList.filter(item => item.title === 'Delivery method').pop().value

  toggleDetails = () => {
    this.setState({ showDropDown: !this.state.showDropDown });
  }

  render() {
    return (
      <aside className={styles.root}>
        <TabletAndDesktop {...this.props} />
        <Mobile
          onClick={this.toggleDetails}
          showDropDown={this.state.showDropDown}
          deliveryMethod={this.getDeliveryMethod()}
          {...this.props}
        />
      </aside>
    );
  }
}
