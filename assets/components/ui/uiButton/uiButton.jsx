// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import SvgArrowRightStraight from 'components/svgs/arrowRightStraight';
import { classNameWithModifiers } from 'helpers/utilities';

import './uiButton.scss';

/*
This button will be rendered as an <a> element or a <button> element
depending on whether it has an `onClick` parameters or a `href` parameter.
This helps preserve the semantics of the underlying HTML.

Sometimes it is helpful to have both an `href` and `onClick` on an <a>
element for side effects such as sending tracking information.
In that case you can use the `trackingOnClick` prop.
*/

// ---- Types ----- //

type PropTypes = {
  children: Node,
  icon?: Node,
  isStatic: boolean,
  href: ?string,
  appearance: 'primary' | 'green' | 'greenHollow' | 'greyHollow',
  iconSide: 'left' | 'right',
  trackingOnClick: ?(void => void),
  onClick: ?(void => void),
};


// ----- Render ----- //

const UiButton = ({
  children, icon, type, onClick, href, disabled, trackingOnClick, appearance, iconSide, isStatic, ...otherProps
}: PropTypes) => {

  const getClassName = (modifiers: string[] = []) =>
    classNameWithModifiers('component-ui-button', [
      appearance,
      `icon-${iconSide}`,
      ...modifiers,
    ]);

  if (isStatic) {
    return (
      <div
        className={getClassName(['static'])}
      >
        <span className="component-ui-button__content">{children}</span>
        {icon}
      </div>
    );
  } else if (href) {
    return (
      <a
        className={getClassName()}
        onClick={trackingOnClick}
        href={href}
        {...otherProps}
      >
        <span className="component-ui-button__content">{children}</span>
        {icon}
      </a>
    );
  }
  return (
    <button
      {...otherProps}
      onClick={(ev) => { if (onClick) { onClick(ev); } if (trackingOnClick) { trackingOnClick(); } }}
      className={getClassName()}
    >
      <span className="component-ui-button__content">{children}</span>
      {icon}
    </button>
  );
};

UiButton.defaultProps = {
  icon: <SvgArrowRightStraight />,
  trackingOnClick: null,
  href: null,
  isStatic: false,
  appearance: 'primary',
  iconSide: 'right',
  onClick: null,
};

export default UiButton;
