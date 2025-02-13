package com.gu.patrons.services

import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.patrons.conf.PatronsIdentityConfig
import com.gu.patrons.model.identity.IdentityErrorResponse
import com.gu.supporterdata.model.Stage.DEV
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import java.util.UUID
import scala.concurrent.duration.DurationInt

@IntegrationTest
class PatronsIdentityServiceSpec extends AsyncFlatSpec with Matchers {
  "PatronsIdentityService" should "get an identity id from an email address" in {
    PatronsIdentityConfig.fromParameterStore(DEV).flatMap { config =>
      val service = new PatronsIdentityService(config, configurableFutureRunner(60.seconds))
      service.getUserIdFromEmail("test@guardian.co.uk").map(id => id.isDefined shouldBe true)
    }
  }

  "PatronsIdentityService" should "not get an identity id from an unknown email address" in {
    PatronsIdentityConfig.fromParameterStore(DEV).flatMap { config =>
      val service = new PatronsIdentityService(config, configurableFutureRunner(60.seconds))
      val email = s"${UUID.randomUUID()}@gu.com"
      service
        .getUserIdFromEmail(email)
        .map {
          case Some(_) =>
            fail("This email shouldn't exist!")
          case None =>
            succeed
        }
    }
  }

  // Ignored as we don't want to create a guest account in Identity every time this test runs
  "PatronsIdentityService" should "create a guest account for an unknown email address" ignore {
    PatronsIdentityConfig.fromParameterStore(DEV).flatMap { config =>
      val service = new PatronsIdentityService(config, configurableFutureRunner(60.seconds))
      val email = s"${UUID.randomUUID()}@gu.com"
      service
        .getOrCreateUserFromEmail(email, None)
        .map(id => id.length should be > 0)
    }
  }

}
