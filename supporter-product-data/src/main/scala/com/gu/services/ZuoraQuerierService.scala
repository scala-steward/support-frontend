package com.gu.services

import com.gu.conf.ZuoraQuerierConfig
import com.gu.model.Stage
import com.gu.model.states.QueryType
import com.gu.model.states.QueryType.{Full, Incremental}
import com.gu.model.zuora.request.{BatchQueryRequest, ZoqlExportQuery}
import com.gu.model.zuora.response.{BatchQueryErrorResponse, BatchQueryResponse}
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.WebServiceHelper
import io.circe.syntax.EncoderOps

import java.time.format.DateTimeFormatter
import java.time.{LocalDate, ZoneId, ZoneOffset}
import java.util.UUID
import scala.collection.Map.empty
import scala.concurrent.{ExecutionContext, Future}
import scala.reflect.classTag

class ZuoraQuerierService(val config: ZuoraQuerierConfig, client: FutureHttpClient)(implicit ec: ExecutionContext)
  extends WebServiceHelper[BatchQueryErrorResponse] {

  override val wsUrl = config.url
  override val httpClient: FutureHttpClient = client
  val authHeaders = Map(
    "apiSecretAccessKey" -> config.password,
    "apiAccessKeyId" -> config.username
  )

  def postQuery(queryType: QueryType): Future[BatchQueryResponse] = {
    val queries = queryType match {
      case Full =>
        val now = LocalDate.now(ZoneId.of("UTC"))
        List(
        ZoqlExportQuery(
          s"${SelectActiveRatePlansQuery.name}-${now.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)}",
          SelectActiveRatePlansQuery.query(now, config.discountProductRatePlanIds)
        )
      )
      case Incremental => List()
    }
    val request = BatchQueryRequest(
      partner = config.partnerId,
      name = "supporter-product-data",
      queries = queries,
      incrementalTime = config.lastSuccessfulQueryTime //TODO test how this behaves with a full query
    )
    postJson[BatchQueryResponse](s"batch-query/", request.asJson, authHeaders)
  }

  def getResults(id: String): Future[BatchQueryResponse] =
    get[BatchQueryResponse](s"batch-query/jobs/$id", authHeaders)

  def getResultFileResponse(fileId: String) = {
    val endpoint = s"/batch-query/file/$fileId"
    getResponse(buildRequest(endpoint, authHeaders, empty))
  }

}
