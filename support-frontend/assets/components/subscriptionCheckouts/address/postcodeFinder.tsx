import { css, ThemeProvider } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import type { TextInputProps } from '@guardian/source-react-components';
import {
	Button,
	buttonThemeReaderRevenueBrandAlt,
	Option,
	Select,
	TextInput,
} from '@guardian/source-react-components';
import { useRef } from 'preact/hooks';
import { Component } from 'react';
import { connect } from 'react-redux';
import type {
	PostcodeFinderActionCreators,
	PostcodeFinderState,
} from 'components/subscriptionCheckouts/address/postcodeFinderStore';
import { postcodeFinderActionCreatorsFor } from 'components/subscriptionCheckouts/address/postcodeFinderStore';
import type { PostcodeFinderResult } from 'components/subscriptionCheckouts/address/postcodeLookup';
import type { AddressType } from 'helpers/subscriptionsForms/addressType';
import 'helpers/subscriptionsForms/addressType';
import 'components/subscriptionCheckouts/address/postcodeLookup';

const root = css`
	display: flex;
	justify-content: flex-start;
	margin-bottom: ${space[6]}px;
`;

const inputStyles = css`
	margin-right: ${space[3]}px;
`;

const buttonStyles = css`
	align-self: flex-end;
`;

// Types
type PropTypes = PostcodeFinderState &
	PostcodeFinderActionCreators & {
		onPostcodeUpdate: (newPostcode: string) => void;
		onAddressUpdate: (result: PostcodeFinderResult) => void;
		id: string;
	};

// Helpers
function InputWithButton({
	onClick,
	isLoading,
	...props
}: TextInputProps & {
	onClick: () => void;
	isLoading: boolean;
}) {
	return (
		<div css={root}>
			<TextInput
				{...props}
				onKeyPress={(e) => {
					if (e.key && e.key === 'Enter') {
						e.preventDefault();
						onClick();
					}
				}}
				css={inputStyles}
				name="postcode"
				width={10}
			/>
			{!isLoading && (
				<ThemeProvider theme={buttonThemeReaderRevenueBrandAlt}>
					<Button
						priority="tertiary"
						css={buttonStyles}
						type="button"
						onClick={onClick}
					>
						Find address
					</Button>
				</ThemeProvider>
			)}
		</div>
	);
}

function PostcodeFinder(props: PropTypes): JSX.Element {
	const selectRef = useRef(null);
	const {
		id,
		postcode,
		results,
		isLoading,
		setPostcode,
		fetchResults,
		error,
		onPostcodeUpdate,
		onAddressUpdate,
	} = props;

	return (
		<div>
			<InputWithButton
				error={error}
				label="Postcode"
				onClick={() => {
					fetchResults(postcode);
				}}
				id={id}
				onChange={(e) => {
					setPostcode(e.target.value);
					onPostcodeUpdate(e.target.value);
				}}
				isLoading={isLoading}
				value={postcode}
			/>
			{results.length > 0 && (
				<Select
					onChange={(e) => {
						if (results[e.currentTarget.value]) {
							onAddressUpdate(results[e.currentTarget.value]);
						}
					}}
					forwardRef={(r) => {
						selectRef = r;
					}}
					id="address"
					label={`${results.length} addresses found`}
				>
					<Option value={null}>Select an address</Option>
					{results.map((result, key) => (
						<Option value={key}>
							{[result.lineOne, result.lineTwo].join(', ')}
						</Option>
					))}
				</Select>
			)}
		</div>
	);
}

// class PostcodeFinder extends Component<PropTypes> {
// 	componentDidUpdate(prevProps: PropTypes) {
// 		if (
// 			this.selectRef &&
// 			this.props.results.join() !== prevProps.results.join()
// 		) {
// 			this.selectRef.focus();
// 		}
// 	}

// 	selectRef: Element & {
// 		focus: (...args: any[]) => any;
// 	};

// 	render() {
// 		const {
// 			id,
// 			postcode,
// 			results,
// 			isLoading,
// 			setPostcode,
// 			fetchResults,
// 			error,
// 			onPostcodeUpdate,
// 			onAddressUpdate,
// 		} = this.props;
// 		return (
// 			<div>
// 				<InputWithButton
// 					error={error}
// 					label="Postcode"
// 					onClick={() => {
// 						fetchResults(postcode);
// 					}}
// 					id={id}
// 					onChange={(e) => {
// 						setPostcode(e.target.value);
// 						onPostcodeUpdate(e.target.value);
// 					}}
// 					isLoading={isLoading}
// 					value={postcode}
// 				/>
// 				{results.length > 0 && (
// 					<Select
// 						onChange={(e) => {
// 							if (results[e.currentTarget.value]) {
// 								onAddressUpdate(results[e.currentTarget.value]);
// 							}
// 						}}
// 						forwardRef={(r) => {
// 							this.selectRef = r;
// 						}}
// 						id="address"
// 						label={`${results.length} addresses found`}
// 					>
// 						<Option value={null}>Select an address</Option>
// 						{results.map((result, key) => (
// 							<Option value={key}>
// 								{[result.lineOne, result.lineTwo].join(', ')}
// 							</Option>
// 						))}
// 					</Select>
// 				)}
// 			</div>
// 		);
// 	}
// }

export const withStore = (
	scope: AddressType,
	traverseState: (arg0: GlobalState) => PostcodeFinderState,
) =>
	connect(
		traverseState,
		postcodeFinderActionCreatorsFor(scope),
	)(PostcodeFinder);
