package com.gu.patrons.services

import com.amazonaws.services.simplesystemsmanagement.model.Parameter
import com.gu.supporterdata.model.Stage
import com.typesafe.scalalogging.StrictLogging

trait ConfigService extends StrictLogging {

  protected def findParameterOrThrow(name: String, params: List[Parameter]) =
    findParameterValue(name, params).getOrElse(
      throw new RuntimeException(s"Missing config value for parameter $name"),
    )

  protected def findParameterValue(name: String, params: List[Parameter]) =
    params
      .find(_.getName.split('/').last == name)
      .map(_.getValue)

}
