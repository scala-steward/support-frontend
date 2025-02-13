import { css } from '@emotion/react';
import {
	visuallyHidden as _visuallyHidden,
	background,
	body,
	from,
	until,
} from '@guardian/source-foundations';
import type { ReactNode } from 'react';
import type { CellData, RowData } from './interactiveTableRow';
import {
	InteractiveTableFooterRow,
	InteractiveTableHeaderRow,
	InteractiveTableRow,
} from './interactiveTableRow';

const visuallyHidden = css`
	${_visuallyHidden}
`;

const table = css`
	position: relative;
	width: 100%;
	${body.small()}

	${until.mobileMedium} {
		font-size: 14px;
	}

	${from.desktop} {
		${body.medium()}
	}
`;

const stickyHeader = css`
	position: sticky;
	top: 0;
	z-index: 1;
	background-color: ${background.ctaPrimary};
`;

type InteractiveTablePropTypes = {
	caption: ReactNode;
	headers: CellData[];
	rows: RowData[];
	footer?: ReactNode;
};

function InteractiveTable({
	caption,
	headers,
	rows,
	footer,
}: InteractiveTablePropTypes): JSX.Element {
	return (
		<table css={table}>
			<caption css={visuallyHidden}>{caption}</caption>
			<thead css={stickyHeader}>
				<InteractiveTableHeaderRow columns={headers} />
			</thead>
			<tbody>
				{rows.map(({ rowId, columns, details, onClick }) => (
					<InteractiveTableRow
						rowId={rowId}
						columns={columns}
						details={details}
						onClick={onClick}
					/>
				))}
			</tbody>
			{footer && (
				<tfoot>
					<InteractiveTableFooterRow>{footer}</InteractiveTableFooterRow>
				</tfoot>
			)}
		</table>
	);
}

export default InteractiveTable;
