package com.gu.support.workers.encoding

import java.io.InputStream
import java.util.Base64

import cats.syntax.either._
import com.gu.support.workers.encoding.Encryption.encrypt
import com.gu.support.workers.model.JsonWrapper
import com.gu.zuora.encoding.CustomCodecs.{jsonWrapperDecoder, jsonWrapperEncoder}
import io.circe.Encoder
import io.circe.parser._
import io.circe.syntax._

import scala.io.Source
import scala.util.Try

/**
 * AWS Step Functions expect to be passed valid Json, as we want to encrypt the whole of the
 * state, we need to wrap it in a Json 'wrapper' object as a Base64 encoded String.
 * This class helps with that
 */
object Wrapper {
  def unWrap(is: InputStream): Try[JsonWrapper] = {
    val t = Try(Source.fromInputStream(is).mkString).flatMap(decode[JsonWrapper](_).toTry)
    is.close()
    t
  }

  def wrap[T](value: T, encrypted: Boolean)(implicit encoder: Encoder[T]): JsonWrapper =
    wrapString(value.asJson.noSpaces, encrypted)

  def wrapString(string: String, encrypted: Boolean): JsonWrapper = JsonWrapper(encodeToBase64String(encrypt(string, encrypted)), None, encrypted)

  def encodeToBase64String(value: Array[Byte]): String = new String(Base64.getEncoder.encode(value))
}
