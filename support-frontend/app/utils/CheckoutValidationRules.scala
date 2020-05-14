package utils

import com.gu.i18n.Currency.GBP
import com.gu.i18n.{Country, CountryGroup, Currency}
import com.gu.support.workers._
import com.gu.support.workers.redemption.RedemptionData
import org.joda.time.LocalDate
import services.stepfunctions.CreateSupportWorkersRequest
import utils.PaidProductValidation.hasValidPaymentDetailsForPaidProduct

object CheckoutValidationRules {
  def validatorFor(productType: ProductType): CreateSupportWorkersRequest => Boolean = productType match {
    case _: DigitalPack => DigitalPackValidation.passes
    case _: Paper => PaperValidation.passes
    case _ => PaidProductValidation.passes
  }
}

object SimpleCheckoutFormValidation {

  def passes(createSupportWorkersRequest: CreateSupportWorkersRequest): Boolean =
    noEmptyNameFields(createSupportWorkersRequest.firstName, createSupportWorkersRequest.lastName) &&
      noExcessivelyLongNameFields(createSupportWorkersRequest.firstName, createSupportWorkersRequest.lastName)

  private def noEmptyNameFields(firstName: String, lastName: String) = !firstName.isEmpty && !lastName.isEmpty

  private def noExcessivelyLongNameFields(firstName: String, lastName: String) = !(firstName.length > 40) && !(lastName.length > 80)

}

object PaidProductValidation {

  def passes(createSupportWorkersRequest: CreateSupportWorkersRequest): Boolean =
    SimpleCheckoutFormValidation.passes(createSupportWorkersRequest) &&
    hasValidPaymentDetailsForPaidProduct(createSupportWorkersRequest.paymentFields)

  def hasValidPaymentDetailsForPaidProduct(paymentDetails: Either[PaymentFields, RedemptionData]): Boolean =
    paymentDetails fold (
      paymentFields => noEmptyPaymentFields(paymentFields),
      _ => false
    )

  def noEmptyPaymentFields(paymentFields: PaymentFields): Boolean = paymentFields match {
    case directDebitDetails: DirectDebitPaymentFields =>
      !directDebitDetails.accountHolderName.isEmpty && !directDebitDetails.accountNumber.isEmpty && !directDebitDetails.sortCode.isEmpty
    case _: StripePaymentMethodPaymentFields => true // already validated in PaymentMethodId.apply
    case stripeDetails: StripeSourcePaymentFields => !stripeDetails.stripeToken.isEmpty
    case payPalDetails: PayPalPaymentFields => !payPalDetails.baid.isEmpty
    case existingDetails: ExistingPaymentFields => !existingDetails.billingAccountId.isEmpty
  }

}

object AddressAndCurrencyValidationRules {

  def deliveredToUkAndPaidInGbp(countryFromRequest: Country, currencyFromRequest: Currency): Boolean =
    countryFromRequest == Country.UK && currencyFromRequest == GBP

  def hasAddressLine1AndCity(address: Address): Boolean = {
    address.lineOne.isDefined && address.city.isDefined
  }


  def hasStateIfRequired(countryFromRequest: Country, stateFromRequest: Option[String], currencyFromRequest: Currency): Boolean =
    if (countryFromRequest == Country.US || countryFromRequest == Country.Canada || countryFromRequest == Country.Australia) {
      stateFromRequest.isDefined
    } else true


  def hasPostcodeIfRequired(countryFromRequest: Country, postcodeFromRequest: Option[String]): Boolean =
    if (
      countryFromRequest == Country.UK ||
        countryFromRequest == Country.US ||
        countryFromRequest == Country.Canada ||
        countryFromRequest == Country.Australia
    ) {
      postcodeFromRequest.isDefined
    } else true


  def currencyIsSupportedForCountry(countryFromRequest: Country, currencyFromRequest: Currency): Boolean = {
    val countryGroupsForCurrency = CountryGroup.allGroups.filter(_.currency == currencyFromRequest)
    countryGroupsForCurrency.flatMap(_.countries).contains(countryFromRequest)
  }

}

object DigitalPackValidation {

  import AddressAndCurrencyValidationRules._

  def passes(createSupportWorkersRequest: CreateSupportWorkersRequest): Boolean = {
    import createSupportWorkersRequest._
    import createSupportWorkersRequest.product._
    import createSupportWorkersRequest.billingAddress._

    val allowCorporateSubs = false
    def isCorporateSub(redemptionData: RedemptionData) =
      allowCorporateSubs //TODO: validate redemption data, this is coming in part 2

    def hasValidPaymentDetails(request: CreateSupportWorkersRequest) = paymentFields.fold(
      paymentFields => PaidProductValidation.noEmptyPaymentFields(paymentFields),
      redemptionData => isCorporateSub(redemptionData)
    )

    SimpleCheckoutFormValidation.passes(createSupportWorkersRequest) &&
      hasStateIfRequired(country, state, currency) &&
      hasPostcodeIfRequired(country, postCode) &&
      currencyIsSupportedForCountry(country, currency) &&
      hasAddressLine1AndCity(billingAddress) &&
      hasValidPaymentDetails(createSupportWorkersRequest)
  }
}

object PaperValidation {

  import AddressAndCurrencyValidationRules._

  def hasFirstDeliveryDate(firstDeliveryDate: Option[LocalDate]): Boolean = firstDeliveryDate.nonEmpty

  def passes(createSupportWorkersRequest: CreateSupportWorkersRequest): Boolean = {

    val hasDeliveryAddressInUKAndPaidInGbp = createSupportWorkersRequest.deliveryAddress match {
      case Some(address) => deliveredToUkAndPaidInGbp(address.country, createSupportWorkersRequest.product.currency)
      case None => false
    }

    val deliveryAddressHasAddressLine1AndCity = createSupportWorkersRequest.deliveryAddress match {
      case Some(address) => hasAddressLine1AndCity(address)
      case None => false
    }

    PaidProductValidation.passes(createSupportWorkersRequest) &&
    hasDeliveryAddressInUKAndPaidInGbp &&
    hasFirstDeliveryDate(createSupportWorkersRequest.firstDeliveryDate) &&
    hasAddressLine1AndCity(createSupportWorkersRequest.billingAddress) &&
    deliveryAddressHasAddressLine1AndCity

  }
}
