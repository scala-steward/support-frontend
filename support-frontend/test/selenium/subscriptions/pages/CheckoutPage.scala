package selenium.subscriptions.pages

import org.scalatest.selenium.Page
import selenium.util.Browser

trait CheckoutPage extends Page with Browser {
  private val stripeRadioButton = id("qa-credit-card")
  private val submitButton = id("qa-submit-button")
  private val directDebitButton = id("qa-direct-debit")
  private val personalDetails = id("qa-personal-details")
  private val cardNumber = name("cardnumber")
  private val expiry = name("exp-date")
  private val cvc = name("cvc")

  def selectStripePaymentMethod(): Unit = clickOn(stripeRadioButton)

  def selectDirectDebitPaymentMethod(): Unit = clickOn(directDebitButton)

  def pageHasLoaded: Boolean = {
    pageHasElement(personalDetails)
  }

  def stripeFormHasLoaded: Boolean = {
    pageHasElement(cardNumber)
  }

  def fillStripeForm: Unit = {
    setValue(cardNumber, "4242424242424242")
    setValue(expiry, "1221")
    setValue(cvc, "123")
  }

  def thankYouPageHasLoaded: Boolean = {
    pageHasElement(className("thank-you-stage"))
  }

  def clickSubmit: Unit = clickOn(submitButton)

  def fillForm: Unit
}
