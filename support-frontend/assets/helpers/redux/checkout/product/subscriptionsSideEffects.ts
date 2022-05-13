import { isAnyOf } from '@reduxjs/toolkit';
import {
	finalPrice,
	getProductPrice,
} from 'helpers/productPrice/productPrices';
import type { SubscriptionsStartListening } from 'helpers/redux/subscriptionsStore';
import {
	setBillingPeriod,
	setDiscountedPrice,
	setProduct,
	setProductOption,
	setProductPrices,
	setSelectedProductPrice,
} from './actions';

const mayChangeProductPrice = isAnyOf(
	setProduct,
	setBillingPeriod,
	setProductOption,
	setProductPrices,
);

export function addProductSideEffects(
	startListening: SubscriptionsStartListening,
): void {
	startListening({
		matcher: mayChangeProductPrice,
		effect(_, listenerApi) {
			const { common, page } = listenerApi.getState();
			const { product } = page.checkoutForm;
			if (product.product !== 'NoProduct') {
				const selectedProductPrice = getProductPrice(
					product.productPrices,
					common.internationalisation.countryId,
					product.billingPeriod,
					product.fulfilmentOption,
					product.productOption,
				);
				const productPriceWithDiscounts = finalPrice(
					product.productPrices,
					common.internationalisation.countryId,
					product.billingPeriod,
				);
				listenerApi.dispatch(setSelectedProductPrice(selectedProductPrice));
				listenerApi.dispatch(setDiscountedPrice(productPriceWithDiscounts));
			}
		},
	});
}
