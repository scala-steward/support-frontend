// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { type Option } from 'helpers/types/option';
import SvgClose from 'components/svgs/close';

import Links from '../links/links';
import VeggieBurgerButton from '../veggieBurgerButton/veggieBurgerButton';

import './mobileMenu.scss';

export type Position = Option<{x: number, y: number}>;

export type PropTypes = {|
  onClose: () => void,
  utility: Node,
  closeButtonAt?: Position,
|};

// ----- Component ----- //


const MobileMenu = ({ onClose, closeButtonAt, utility }: PropTypes) =>
  (
    <div
      className="component-header-mobile-menu"
      style={closeButtonAt && { width: closeButtonAt.x }}
    >
      <div className="component-header-mobile-menu__scroll">
        <Links location="mobile" />
        {utility &&
          <div className="component-header-mobile-menu__utility">
            {utility}
          </div>
        }
      </div>
      <VeggieBurgerButton
        style={closeButtonAt && { top: closeButtonAt.y }}
        label="close"
        onClick={onClose}
      >
        <SvgClose />
      </VeggieBurgerButton>
    </div>
  );

MobileMenu.defaultProps = {
  closeButtonAt: null,
  utility: null,
};

export default MobileMenu;
