package com.gu.conf

import com.amazonaws.services.simplesystemsmanagement.model.Parameter
import com.gu.model.Stage
import com.gu.model.Stage.{DEV, PROD, UAT}
import com.gu.services.IncrementalTimeService.lastSuccessfulQueryTime
import com.gu.services.ParameterStoreService

import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

case class ZuoraQuerierConfig(
  url: String,
  partnerId: String,
  username: String,
  password: String,
  discountProductRatePlanIds: List[String],
  lastSuccessfulQueryTime: Option[ZonedDateTime]
)

object ZuoraQuerierConfig {

  def load(stage: Stage): Future[ZuoraQuerierConfig] = {

    ParameterStoreService(stage).getParametersByPath("zuora-config").map {
      params =>
        ZuoraQuerierConfig(
          findParameterOrThrow("url", params),
          findParameterOrThrow("partnerId", params),
          findParameterOrThrow("username", params),
          findParameterOrThrow("password", params),
          getDiscountProductRatePlanIds(stage),
          findParameterValue(lastSuccessfulQueryTime, params).map(ZonedDateTime.parse(_, DateTimeFormatter.ISO_DATE_TIME))
        )
    }
  }

  private def getDiscountProductRatePlanIds(stage: Stage) =
    stage match {
      case DEV => List("2c92c0f852f2ebb20152f9269f067819")
      case UAT => List("2c92c0f953078a5601531299dae54a4d")
      case PROD => List(
        "2c92a00d6f9de7f6016f9f6f52765aa4",
        "2c92a0076ae9189c016b080c930a6186",
        "2c92a0ff5345f9220153559d915d5c26",
        "2c92a0fe7375d60901737c64808e4be1",
        "2c92a0fe750b35d001750d4522f43817",
        "2c92a00f7468817d01748bd88f0d1d6c",
        "2c92a0117468816901748bdb3a8c1ac4"
      )
    }

  private def findParameterValue(name: String, params: List[Parameter]) =
    params
      .find(_.getName.endsWith(name))
      .map(_.getValue)

  private def findParameterOrThrow(name: String, params: List[Parameter]) =
    findParameterValue(name, params).toRight(
      new RuntimeException(s"Missing config value for parameter $name in ZuoraQuerierConfig")
    ).toTry.get


}
