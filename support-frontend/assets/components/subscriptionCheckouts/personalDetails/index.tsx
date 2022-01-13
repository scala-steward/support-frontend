import type { PersonalDetailsControllerProps } from './controller';
import PersonalDetailsController from './controller';
import PersonalDetailsUI from './ui';

export default function PersonalDetails(
	props: Omit<PersonalDetailsControllerProps, 'render'>,
): JSX.Element {
	return (
		<PersonalDetailsController
			{...props}
			render={(renderProps) => <PersonalDetailsUI {...renderProps} />}
		/>
	);
}
