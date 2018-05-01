package lib

import actions.CacheControl
import com.typesafe.scalalogging.LazyLogging
import monitoring.SafeLogger
import play.api.PlayException.ExceptionSource
import play.api.{Configuration, Environment, UsefulException}
import play.api.http.DefaultHttpErrorHandler
import play.api.routing.Router
import play.api.mvc.{RequestHeader, Result}
import play.api.mvc.Results.{NotFound, InternalServerError}
import assets.AssetsResolver
import views.html.react

import play.core.SourceMapper
import scala.concurrent.{ExecutionContext, Future}
import scala.concurrent.duration._

class CustomHttpErrorHandler(
    env: Environment,
    config: Configuration,
    sourceMapper: Option[SourceMapper],
    router: => Option[Router],
    val assets: AssetsResolver
)(implicit val ec: ExecutionContext) extends DefaultHttpErrorHandler(env, config, sourceMapper, router) with LazyLogging {

  override def onClientError(request: RequestHeader, statusCode: Int, message: String = ""): Future[Result] =
    super.onClientError(request, statusCode, message).map(_.withHeaders(CacheControl.defaultCacheHeaders(30.seconds, 30.seconds): _*))

  override protected def onNotFound(request: RequestHeader, message: String): Future[Result] =
    Future.successful(
      NotFound(react("Error 404", "error-404-page", "error404Page.js")(assets, request))
        .withHeaders(CacheControl.defaultCacheHeaders(30.seconds, 30.seconds): _*)
    )

  override protected def onProdServerError(request: RequestHeader, exception: UsefulException): Future[Result] =
    Future.successful(
      InternalServerError(react("Error 500", "error-500-page", "error500Page.js")(assets, request))
        .withHeaders(CacheControl.noCache)
    )

  override protected def onBadRequest(request: RequestHeader, message: String): Future[Result] =
    super.onBadRequest(request, message).map(_.withHeaders(CacheControl.noCache))

  override protected def logServerError(request: RequestHeader, usefulException: UsefulException): Unit = {
    val lineInfo = usefulException match {
      case source: ExceptionSource => s"${source.sourceName()} at line ${source.line()}"
      case _ => "unknown line number, please check the logs"
    }
    val sanitizedExceptionDetails = s"Caused by: ${usefulException.cause} in $lineInfo"
    val requestDetails = s"(${request.method}) [${request.path}]" // Use path, not uri, as query strings often contain things like ?api-key=my_secret

    // We are deliberately bypassing the SafeLogger here, because we need to use standard string interpolation to make this exception handling useful.
    logger.error(SafeLogger.sanitizedLogMessage, s"Internal server error, for $requestDetails. $sanitizedExceptionDetails")

    super.logServerError(request, usefulException) // We still want the full uri and stack trace in our logs, just not in Sentry
  }

}
