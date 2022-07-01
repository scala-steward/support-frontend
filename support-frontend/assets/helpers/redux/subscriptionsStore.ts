import type { TypedStartListening } from '@reduxjs/toolkit';
import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import { renderError } from 'helpers/rendering/render';
import { createReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import type { DateYMDString } from 'helpers/types/DateString';
import { addAddressSideEffects } from './checkout/address/sideEffects';
import { addPersonalDetailsSideEffects } from './checkout/personalDetails/subscriptionsSideEffects';
import {
	setBillingPeriod,
	setFulfilmentOption,
	setProductOption,
	setProductType,
	setStartDate,
} from './checkout/product/actions';
import { setInitialCommonState } from './commonState/actions';
import { commonReducer } from './commonState/reducer';
import type { CommonState } from './commonState/state';
import { getInitialState } from './utils/setup';

const subscriptionsPageReducer = createReducer();

export type SubscriptionsReducer = typeof subscriptionsPageReducer;

const baseReducer = {
	common: commonReducer,
	page: subscriptionsPageReducer,
};

// Listener middleware allows us to specify side-effects for certain actions
// https://redux-toolkit.js.org/api/createListenerMiddleware
const listenerMiddleware = createListenerMiddleware();

export type SubscriptionsStartListening = TypedStartListening<
	SubscriptionsState,
	SubscriptionsDispatch
>;

export const startSubscriptionsListening =
	listenerMiddleware.startListening as SubscriptionsStartListening;

const subscriptionsStore = configureStore({
	reducer: baseReducer,
	// Makes devtools work correctly with the re-created store
	devTools: false,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type SubscriptionsStore = typeof subscriptionsStore;

export function addPageReducer(
	newReducer?: SubscriptionsReducer,
): SubscriptionsStore {
	// For context on why we are re-creating the store at runtime
	// https://github.com/guardian/support-frontend/pull/3595#discussion_r834202633
	const store = configureStore({
		reducer: {
			common: commonReducer,
			page: newReducer ?? subscriptionsPageReducer,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().prepend(listenerMiddleware.middleware),
	});
	addPersonalDetailsSideEffects(startSubscriptionsListening);
	addAddressSideEffects(startSubscriptionsListening);
	return store;
}

export function initReduxForSubscriptions(
	product: SubscriptionProduct,
	initialBillingPeriod: BillingPeriod,
	pageReducer?: (initialState: CommonState) => SubscriptionsReducer,
	startDate?: DateYMDString,
	productOption?: ProductOptions,
	getFulfilmentOptionForCountry?: (country: string) => FulfilmentOptions,
): SubscriptionsStore {
	try {
		const initialState = getInitialState();
		const newStore = addPageReducer(pageReducer?.(initialState));

		newStore.dispatch(setInitialCommonState(initialState));
		newStore.dispatch(setProductType(product));
		newStore.dispatch(setBillingPeriod(initialBillingPeriod));

		startDate && newStore.dispatch(setStartDate(startDate));
		productOption && newStore.dispatch(setProductOption(productOption));
		getFulfilmentOptionForCountry &&
			newStore.dispatch(
				setFulfilmentOption(
					getFulfilmentOptionForCountry(
						initialState.internationalisation.countryId,
					),
				),
			);

		return newStore;
	} catch (err) {
		renderError(err as Error, null);
		throw err;
	}
}

export type SubscriptionsState = ReturnType<typeof subscriptionsStore.getState>;

export type SubscriptionsDispatch = typeof subscriptionsStore.dispatch;
