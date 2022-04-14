import type { TypedStartListening } from '@reduxjs/toolkit';
import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { renderError } from 'helpers/rendering/render';
import { createWithDeliveryCheckoutReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { addPersonalDetailsSideEffects } from './checkout/personalDetails/subscriptionsSideEffects';
import { setInitialCommonState } from './commonState/actions';
import { commonReducer } from './commonState/reducer';
import type { CommonState } from './commonState/state';
import { initialCommonState } from './commonState/state';
import { getInitialState } from './utils/setup';

const subscriptionsPageReducer = createWithDeliveryCheckoutReducer(
	initialCommonState.internationalisation.countryId,
	'DigitalPack',
	'Monthly',
	null,
	null,
	null,
);

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
	return store;
}

export function initReduxForSubscriptions(
	pageReducer?: (initialState: CommonState) => SubscriptionsReducer,
): SubscriptionsStore {
	try {
		const initialState = getInitialState();
		const newStore = addPageReducer(pageReducer?.(initialState));
		newStore.dispatch(setInitialCommonState(initialState));

		return newStore;
	} catch (err) {
		renderError(err as Error, null);
		throw err;
	}
}

export type SubscriptionsState = ReturnType<typeof subscriptionsStore.getState>;

export type SubscriptionsDispatch = typeof subscriptionsStore.dispatch;
