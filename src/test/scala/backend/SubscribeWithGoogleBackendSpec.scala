package backend

import cats.data.EitherT
import cats.implicits._
import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.acquisition.model.{AcquisitionSubmission, GAData, OphanIds}
import com.gu.acquisition.model.errors.AnalyticsServiceError
import model.{AcquisitionData, ClientBrowserInfo, DefaultThreadPool}
import model.subscribewithgoogle.GoogleRecordPayment
import org.scalatest.mockito.MockitoSugar
import org.scalatest.{Matchers, WordSpec}
import services._
import org.mockito.{Matchers => Match}
import org.mockito.Mockito._
import org.scalatest.concurrent.IntegrationPatience
import util.FutureEitherValues

import scala.concurrent.{ExecutionContext, Future}

class SubscribeWithGoogleBackendFixture()(implicit ec: ExecutionContext) extends MockitoSugar {

  val mockDbService = mock[DatabaseService]
  val mockIdentityService = mock[IdentityService]
  val mockOphanService = mock[AnalyticsService]
  val mockEmailService = mock[EmailService]
  val mockCloudWatchService = mock[CloudWatchService]


  val currentTime = System.currentTimeMillis()
  val firstName = "Zechs"
  val email = "email@email.com"
  val status = "Paid"
  val amount = BigDecimal(5.00)
  val current = "GBP"
  val countryCode = "UK"
  val paymentId = "generatedPayment"


  val subscribeWithGooglePayment = GoogleRecordPayment(firstName,
    email,
    status,
    amount,
    current,
    countryCode,
    paymentId,
    currentTime)



  val acquisitionData = AcquisitionData(None, None, None, None, None, None, None, None, None, None, None, None, None)
  val clientBrowserInfo = ClientBrowserInfo("localhost", "no idea", None, "localhost", None)


  val identityError: IdentityClient.Result[Long] = EitherT.left(Future.successful(IdentityClient.ContextualError(
    IdentityClient.Error.fromThrowable(new Exception("Identity error response")),
    IdentityClient.GetUser("email@email.com")
  )))

  val ophanError: List[AnalyticsServiceError] = List(AnalyticsServiceError.BuildError("Ophan error response"))
  val dbError: EitherT[Future, DatabaseService.Error, Unit] = EitherT.left(Future.successful(DatabaseService.Error("DB error response", None)))


  val failedIdentityErrors = BackendError.combineResults(
    identityError.map(_=> ()).leftMap(BackendError.fromIdentityError),
    identityError.map(_=> ()).leftMap(BackendError.fromIdentityError)
  )(DefaultThreadPool(ec))

  val combinedDbErrors = BackendError.combineResults(
    dbError.map(_=> ()).leftMap(BackendError.fromDatabaseError),
    dbError.map(_=> ()).leftMap(BackendError.fromDatabaseError)
  )(DefaultThreadPool(ec))


  val identityReply: IdentityClient.Result[Long] = EitherT.right(Future.successful(1L))
  val acquisitionSubmission: EitherT[Future, List[AnalyticsServiceError], AcquisitionSubmission] =
    EitherT.right(Future.successful(AcquisitionSubmission.apply(OphanIds(None, None, None),
      GAData.apply("localhost", "", None, None),
      null //todo: Properly later.
    )))
  val dbResult:EitherT[Future, DatabaseService.Error, Unit] = EitherT.right(Future.successful(()))

  val emailResult: EitherT[Future, EmailService.Error, SendMessageResult] =
    EitherT.right(Future.successful(new SendMessageResult()))

  val acquisitionSubmissionError: EitherT[Future, List[AnalyticsServiceError], AcquisitionSubmission] =
    EitherT.left(Future.successful(ophanError))


  val subscribeWithGoogleBackend = SubscribeWithGoogleBackend.apply(mockDbService,
    mockIdentityService,
    mockOphanService,
    mockEmailService,
    mockCloudWatchService)(DefaultThreadPool(ec))

}



class SubscribeWithGoogleBackendSpec extends WordSpec with Matchers with FutureEitherValues
  with IntegrationPatience  {

  "Subscribe with Google Backend" must {
    implicit val executionContext: ExecutionContext = ExecutionContext.global

    "record a contribution" in new SubscribeWithGoogleBackendFixture(){

      when(mockIdentityService.getOrCreateIdentityIdFromEmail(email)).thenReturn(identityReply)
      when(mockOphanService.submitAcquisition(Match.any())(Match.any())).thenReturn(acquisitionSubmission)
      when(mockDbService.insertContributionData(Match.any())).thenReturn(dbResult)
      when(mockEmailService.sendThankYouEmail(Match.any())).thenReturn(emailResult)

      val recordResult: EitherT[Future, BackendError, Unit] =
        subscribeWithGoogleBackend.recordPayment(subscribeWithGooglePayment, acquisitionData, clientBrowserInfo)

      recordResult.futureRight shouldBe ()

      verify(mockIdentityService, times(1)).getOrCreateIdentityIdFromEmail(email)

      verify(mockOphanService, times(1)).submitAcquisition(Match.any())(Match.any())
      verify(mockDbService, times(1)).insertContributionData(Match.any())
      verify(mockEmailService, times(1)).sendThankYouEmail(Match.any())
    }

    "record a contribution when ophan fails" in new SubscribeWithGoogleBackendFixture(){


      when(mockIdentityService.getOrCreateIdentityIdFromEmail(email)).thenReturn(identityReply)
      when(mockOphanService.submitAcquisition(Match.any())(Match.any())).thenReturn(acquisitionSubmissionError)
      when(mockDbService.insertContributionData(Match.any())).thenReturn(dbResult)
      when(mockEmailService.sendThankYouEmail(Match.any())).thenReturn(emailResult)

      val recordResult: EitherT[Future, BackendError, Unit] =
        subscribeWithGoogleBackend.recordPayment(subscribeWithGooglePayment, acquisitionData, clientBrowserInfo)

      recordResult.futureLeft shouldBe BackendError.fromOphanError(ophanError)

      verify(mockIdentityService, times(1)).getOrCreateIdentityIdFromEmail(email)

      verify(mockOphanService, times(1)).submitAcquisition(Match.any())(Match.any())
      verify(mockDbService, times(2)).insertContributionData(Match.any())
      verify(mockEmailService, times(1)).sendThankYouEmail(Match.any())
    }


    "record a contribution when identity fails and do not send an email" in new SubscribeWithGoogleBackendFixture(){


      when(mockIdentityService.getOrCreateIdentityIdFromEmail(email)).thenReturn(identityError)
      when(mockOphanService.submitAcquisition(Match.any())(Match.any())).thenReturn(acquisitionSubmissionError)
      when(mockDbService.insertContributionData(Match.any())).thenReturn(dbResult)
      when(mockEmailService.sendThankYouEmail(Match.any())).thenReturn(emailResult)

      val recordResult: EitherT[Future, BackendError, Unit] =
        subscribeWithGoogleBackend.recordPayment(subscribeWithGooglePayment, acquisitionData, clientBrowserInfo)

      recordResult.futureLeft shouldBe failedIdentityErrors.futureLeft

      verify(mockIdentityService, times(1)).getOrCreateIdentityIdFromEmail(email)

      verify(mockOphanService, times(0)).submitAcquisition(Match.any())(Match.any())
      verify(mockDbService, times(1)).insertContributionData(Match.any())
      verify(mockEmailService, times(0)).sendThankYouEmail(Match.any())
    }

    "send thank you email when db fails - alert cloudwatch" in new SubscribeWithGoogleBackendFixture(){

      //TODO: Alert cloudwatch to failure

      when(mockIdentityService.getOrCreateIdentityIdFromEmail(email)).thenReturn(identityReply)
      when(mockOphanService.submitAcquisition(Match.any())(Match.any())).thenReturn(acquisitionSubmission)
      when(mockDbService.insertContributionData(Match.any())).thenReturn(dbError)
      when(mockEmailService.sendThankYouEmail(Match.any())).thenReturn(emailResult)

      val recordResult: EitherT[Future, BackendError, Unit] =
        subscribeWithGoogleBackend.recordPayment(subscribeWithGooglePayment, acquisitionData, clientBrowserInfo)

      recordResult.futureLeft shouldBe BackendError.fromDatabaseError(dbError.futureLeft)

      verify(mockIdentityService, times(1)).getOrCreateIdentityIdFromEmail(email)

      verify(mockOphanService, times(1)).submitAcquisition(Match.any())(Match.any())
      verify(mockDbService, times(2)).insertContributionData(Match.any())
      verify(mockEmailService, times(1)).sendThankYouEmail(Match.any())
    }
  }
}
