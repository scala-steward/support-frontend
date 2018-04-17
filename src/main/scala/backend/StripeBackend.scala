package backend

import cats.data.EitherT
import cats.instances.future._
import cats.syntax.apply._
import com.stripe.model.{Charge, Event}
import com.typesafe.scalalogging.StrictLogging
import play.api.libs.ws.WSClient

import scala.concurrent.Future
import conf._
import conf.ConfigLoader._
import model._
import model.acquisition.StripeAcquisition
import model.db.ContributionData
import model.stripe.{StripeApiError, StripeChargeData, StripeChargeSuccess, StripeHook}
import services._
import util.EnvironmentBasedBuilder

// Provides methods required by the Stripe controller
class StripeBackend(
    stripeService: StripeService,
    databaseService: DatabaseService,
    identityService: IdentityService,
    ophanService: OphanService,
    emailService: EmailService
)(implicit pool: DefaultThreadPool) extends StrictLogging {

  // Convert the result of the identity id operation,
  // into the monad used by the for comprehension in the createCharge() method.
  def getOrCreateIdentityIdFromEmail(email: String): EitherT[Future, BackendError, Option[Long]] =
    identityService
      .getOrCreateIdentityIdFromEmail(email)
      .leftMap(BackendError.fromIdentityError)
      .map(Option(_))
      .recover {
        case err =>
          logger.error("Error getting identityId", err)
          None
      }

  def insertContributionData(contributionData: ContributionData):
  EitherT[Future, BackendError, Unit] =
    databaseService.insertContributionData(contributionData)
      .leftMap(BackendError.fromDatabaseError)

  def submitAcquisitionToOphan(acquisition: StripeAcquisition): EitherT[Future, BackendError, Unit] =
    ophanService.submitAcquisition(acquisition)
      .bimap(BackendError.fromOphanError, _ => ())

  def createStripeCharge(data: StripeChargeData): EitherT[Future, BackendError, Charge] =
    stripeService.createCharge(data)
      .leftMap(BackendError.fromStripeApiError)

  def trackContribution(charge: Charge, data: StripeChargeData, identityId: Option[Long]):
  EitherT[Future, BackendError, Unit]  =
    BackendError.combineResults(
      insertContributionData(ContributionData.fromStripeCharge(identityId, charge)),
      submitAcquisitionToOphan(StripeAcquisition(data, charge, identityId))
    )

  // Ok using the default thread pool - the mapping function is not computationally intensive, nor does is perform IO.
  def createCharge(data: StripeChargeData):
  EitherT[Future, BackendError, StripeChargeSuccess] =
    for {
      charge <- createStripeCharge(data)

      signedInUserEmail = data.signedInUserEmail
      paymentEmail = data.paymentData.email
      email = signedInUserEmail.getOrElse(paymentEmail)

      identityId <- getOrCreateIdentityIdFromEmail(email)
      _ = trackContribution(charge, data, identityId)
      _ = emailService.sendThankYouEmail(email)
    } yield StripeChargeSuccess.fromCharge(charge)


  def processPaymentHook(stripeHook: StripeHook):
  EitherT[Future, StripeApiError, Event] = {
    for {
      event <- stripeService.processPaymentHook(stripeHook)
      _ = databaseService.flagContributionAsRefunded(stripeHook.data.`object`.id)
    } yield event
  }


}

object StripeBackend {

  private def apply(stripeService: StripeService, databaseService: DatabaseService,
    identityService: IdentityService, ophanService: OphanService, emailService: EmailService)(implicit pool: DefaultThreadPool): StripeBackend =
    new StripeBackend(stripeService, databaseService, identityService, ophanService, emailService)

  class Builder(configLoader: ConfigLoader, databaseProvider: DatabaseProvider)(
    implicit defaultThreadPool: DefaultThreadPool,
    stripeThreadPool: StripeThreadPool,
    jdbcThreadPool: JdbcThreadPool,
    wsClient: WSClient
  ) extends EnvironmentBasedBuilder[StripeBackend] {

    override def build(env: Environment): InitializationResult[StripeBackend] = (
      configLoader
        .loadConfig[Environment, StripeConfig](env)
        .map(StripeService.fromStripeConfig): InitializationResult[StripeService],
      databaseProvider
        .loadDatabase(env)
        .map(PostgresDatabaseService.fromDatabase): InitializationResult[DatabaseService],
      configLoader
        .loadConfig[Environment, IdentityConfig](env)
        .map(IdentityService.fromIdentityConfig): InitializationResult[IdentityService],
      configLoader
        .loadConfig[Environment, OphanConfig](env)
        .andThen(OphanService.fromOphanConfig): InitializationResult[OphanService],
      configLoader
        .loadConfig[Environment, EmailConfig](env)
        .andThen(EmailService.fromEmailConfig): InitializationResult[EmailService]
    ).mapN(StripeBackend.apply)
  }
}

