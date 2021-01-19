import LibraryVersions.{awsClientVersion, circeVersion}
import sbt.Keys.{libraryDependencies, resolvers}
import com.gu.riffraff.artifact.RiffRaffArtifact.autoImport.riffRaffManifestProjectName

version := "0.1-SNAPSHOT"


libraryDependencies ++= Seq(
  "com.amazonaws" % "aws-java-sdk-s3" % awsClientVersion,
  "com.amazonaws" % "aws-java-sdk-sqs" % awsClientVersion,
  "com.amazonaws" % "aws-java-sdk-stepfunctions" % awsClientVersion,
  "com.amazonaws" % "aws-lambda-java-core" % "1.2.1",
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion
)

riffRaffPackageType := assembly.value
riffRaffManifestProjectName := s"support:supporter-product-data"
riffRaffManifestBranch := Option(System.getenv("BRANCH_NAME")).getOrElse("unknown_branch")
riffRaffBuildIdentifier := Option(System.getenv("BUILD_NUMBER")).getOrElse("DEV")
riffRaffManifestVcsUrl := "git@github.com/guardian/support-frontend.git"
riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffArtifactResources += (file("supporter-product-data/cloudformation/cfn.yaml"), "cfn/cfn.yaml")
assemblyJarName := s"${name.value}.jar"
assemblyMergeStrategy in assembly := {
  case PathList("models", xs@_*) => MergeStrategy.discard
  case x if x.endsWith("io.netty.versions.properties") => MergeStrategy.first
  case x if x.endsWith("module-info.class") => MergeStrategy.discard
  case "mime.types" => MergeStrategy.first
  case y =>
    val oldStrategy = (assemblyMergeStrategy in assembly).value
    oldStrategy(y)
}

lazy val deployToCode = inputKey[Unit]("Directly update AWS lambda code from DEV instead of via RiffRaff for faster feedback loop")

deployToCode := {
  import scala.sys.process._
  val s3Bucket = "supporter-product-data-dist"
  val s3Path = "CODE/supporter-product-data.jar"
  (s"aws s3 cp ${assembly.value} s3://" + s3Bucket + "/" + s3Path + " --profile membership --region eu-west-1").!!
  List(
    "-SupporterProductDataQuerier-",
    "-SupporterProductDataFetcher-"
  ).foreach(functionPartial =>
    s"aws lambda update-function-code --function-name support${functionPartial}CODE --s3-bucket $s3Bucket --s3-key $s3Path --profile membership --region eu-west-1".!!
  )

}
