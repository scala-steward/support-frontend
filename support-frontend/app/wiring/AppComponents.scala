package wiring

import com.gu.monitoring.SafeLogger
import controllers.AssetsComponents
import filters.{CacheHeadersCheck, SetCookiesCheck}
import lib.{CustomHttpErrorHandler, ErrorController}
import monitoring.{SentryLogging, StateMachineMonitor}
import play.api.BuiltInComponentsFromContext
import play.api.libs.ws.ahc.AhcWSComponents
import play.api.mvc.EssentialFilter
import play.api.routing.Router
import play.filters.HttpFiltersComponents
import play.filters.cors.{CORSComponents, CORSConfig}
import play.filters.csp.CSPComponents
import play.filters.gzip.GzipFilter

trait AppComponents
    extends PlayComponents
    with AhcWSComponents
    with AssetsComponents
    with Controllers
    with Services
    with ApplicationConfiguration
    with ActionBuilders
    with Assets
    with GoogleAuth
    with CORSComponents
    with CSPComponents
    with HttpFiltersComponents {
  self: BuiltInComponentsFromContext =>

  private lazy val customHandler: CustomHttpErrorHandler = new CustomHttpErrorHandler(
    environment,
    configuration,
    devContext.map(_.sourceMapper),
    Some(router),
    assetsResolver,
    allSettingsProvider,
    appConfig.stage,
  )
  override lazy val httpErrorHandler = customHandler
  override lazy val errorController = new ErrorController(actionRefiners, customHandler)

  final override lazy val corsConfig: CORSConfig = CORSConfig().withOriginsAllowed(_ == appConfig.supportUrl)

  override lazy val httpFilters: Seq[EssentialFilter] = Seq(
    cspFilter,
    corsFilter,
    new SetCookiesCheck(),
    securityHeadersFilter,
    new CacheHeadersCheck(),
    new GzipFilter(shouldGzip = (req, _) => !req.path.startsWith("/assets/images")),
  )

  override lazy val router: Router = new _root_.router.Routes(
    httpErrorHandler,
    applicationController,
    errorController,
    diagnosticsController,
    siteMapController,
    articleShareController,
    createSubscriptionController,
    supportWorkersStatusController,
    stripeController,
    identityController,
    subscriptionsController,
    digitalPackController,
    digitalPackFormController,
    weeklyController,
    weeklyFormController,
    paperController,
    paperFormController,
    redemptionController,
    getAddressController,
    loginController,
    testUsersController,
    payPalRegularController,
    payPalOneOffController,
    directDebitController,
    promotionsController,
    pricesController,
    assetController,
    faviconController,
  )

  SentryLogging.init(appConfig)
  new StateMachineMonitor(supportWorkersClient, actorSystem).start()
}
