import { Provider } from 'react-redux';
import { detect } from 'helpers/internationalisation/countryGroup';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { initReduxForContributions } from 'helpers/redux/contributionsStore';
import { renderPage } from 'helpers/rendering/render';
import * as user from 'helpers/user/user';
import { setUserStateActions } from '../contributions-landing/setUserStateActions';
import ContributionsCheckout from './ContributionsCheckout';
import { init as formInit } from './init';

// ---- Redux ---- //

const store = initReduxForContributions();
const countryGroupId: CountryGroupId = detect();
user.init(store.dispatch, setUserStateActions(countryGroupId));
formInit(store);

// ---- Component ---- //

function ContributionsCheckoutInEpic() {
	return (
		<Provider store={store}>
			<ContributionsCheckout />
		</Provider>
	);
}

// ---- Render ---- //

renderPage(<ContributionsCheckoutInEpic />, 'contributions-checkout-in-epic');
