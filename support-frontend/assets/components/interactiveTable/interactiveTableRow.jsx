// @flow
// $FlowIgnore
import React, { useState, type Node } from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { border, brandAltBackground } from '@guardian/src-foundations/palette';
import { textSans } from '@guardian/src-foundations/typography';
import { SvgChevronDownSingle } from '@guardian/src-icons';
import { Button } from '@guardian/src-button';
import { neutral, sport } from '@guardian/src-foundations/palette';
import { visuallyHidden as _visuallyHidden } from '@guardian/src-foundations/accessibility';

const borderStyle = `${border.secondary} 1px solid`;

const visuallyHidden = css`
  ${_visuallyHidden}
`;

const tableRow = css`
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 40px 40px 42px;
  grid-template-rows: 72px 1fr;
  text-align: left;
  background-color: ${neutral[100]};
  max-height: 72px;
  transition: all 0.2s ease-in-out;

  :not(:first-of-type) {
    margin-top: ${space[2]}px;
  }

  ${from.desktop} {
    grid-template-columns: 1fr 72px 72px 60px;
  }
`;

const tableHeaderRow = css`
  background-color: transparent;
  color: ${neutral[100]};
  grid-template-rows: 1fr;
`;

const tableRowOpen = css`
  max-height: 600px;
`;

const tableCell = css`
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 72px;
  padding: ${space[4]}px 0;
  padding-right: ${space[3]}px;
`;

const headingCell = css`
  align-self: end;
  ${textSans.small({ fontWeight: 'bold' })}
  padding-bottom: 0;
  height: unset;
`;

const primaryTableCell = css`
  justify-content: flex-start;
  padding-left: ${space[3]}px;

  ${from.desktop} {
    padding-left: 80px;
  }
`;

const iconCell = css`
  max-width: 48px;
`;

const expandableButtonCell = css`
  position: relative;
  max-height: 72px;
  display: flex;
  align-items: center;
  border-left: ${borderStyle};
  padding: 5px;
  background-color: ${sport[800]};
`;

const detailsCell = css`
  max-height: unset;
  min-height: 72px;
  grid-column: 1 / span 4;
  justify-content: flex-start;
  background-color: ${sport[800]};
  border-top: ${borderStyle};
  padding-left: ${space[3]}px;

  ${from.desktop} {
    padding-left: 80px;
    padding-right: ${space[9]}px;
  }
`;

const detailsHidden = css`
  display: none;
`;

const detailsVisible = css`
  display: block;
`;

const toggleButton = css`
  /* position: absolute;
  left: ${space[4]}px;
  right: ${space[4]}px;
  width: calc(100% - 32px); */
  /* Allows space for the 5px focus box shadow */
  height: 62px;
  width: 100%;
  /* justify-content: flex-end; */
  align-items: center;
  overflow: hidden;

  span {
    overflow: hidden;
  }

  svg {
    fill: currentColor;
    height: ${space[4]}px;
    max-width: ${space[5]}px;
    transition: transform 0.2s ease-in-out;
  }
`;

const toggleButtonOpen = css`
  svg {
    transform: rotate(180deg);
  }
`;

const finalRow = css`
  display: block;
  margin-top: ${space[2]}px;
  ${from.desktop} {
    padding-left: 32px;
  }
`;

const yellowBackground = css`
  background: ${brandAltBackground.primary};
`;

export type CellData = {|
  content: Node;
  isPrimary?: boolean;
  isIcon?: boolean;
  isHidden?: boolean;
  isStyleless?: boolean;
|}

export type RowData = {|
  rowId: string;
  columns: CellData[];
  details: Node;
|}

export function InteractiveTableHeaderRow({ columns }: { columns: CellData[] }) {
  return (
    <tr role="row" css={[tableRow, tableHeaderRow]}>
      {columns.map(col => (
        <th scope="col" role="columnHeader" css={col.isStyleless ? '' : [tableCell, headingCell, col.isIcon ? iconCell : '']}>
          <span css={col.isHidden ? visuallyHidden : ''}>{col.content}</span>
        </th>
      ))}
    </tr>
  );
}

export function InteractiveTableFooterRow({ children }: { children: Node }) {
  return (
    <tr role="row" css={[finalRow, yellowBackground]}>
      <td role="cell" colSpan="5" aria-colspan="5" css={[tableCell, primaryTableCell]}>
        {children}
      </td>
    </tr>
  );
}

export function InteractiveTableRow({
  rowId, columns, details,
}: RowData) {
  // TODO: revert to false before shipping!!
  const [showDetails, setShowDetails] = useState<boolean>(true);

  return (
    <tr role="row" css={[tableRow, showDetails ? tableRowOpen : '']}>
      {columns.map((column) => {
        if (column.isPrimary) {
          return (
            <th scope="row" role="rowHeader" css={[tableCell, primaryTableCell]}>
              {column.content}
            </th>
          );
        }
        return <td role="cell" css={[tableCell, iconCell]}>{column.content}</td>;
      })}
      <td role="cell" css={expandableButtonCell}>
        <Button
          hideLabel
          priority="subdued"
          icon={<SvgChevronDownSingle />}
          css={[toggleButton, showDetails ? toggleButtonOpen : '']}
          aria-expanded={showDetails ? 'true' : 'false'}
          aria-controls={`${rowId}-details`}
          onClick={() => setShowDetails(!showDetails)}
        >
          {`${showDetails ? 'Hide' : 'Show'} more details`}
        </Button>
      </td>
      <td
        role="cell"
        hidden={!showDetails}
        id={`${rowId}-details`}
        css={[tableCell, detailsCell, showDetails ? detailsVisible : detailsHidden]}
      >
        {details}
      </td>
    </tr>
  );
}
