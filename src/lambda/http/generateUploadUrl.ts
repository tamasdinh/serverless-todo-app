import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { S3 } from 'aws-sdk'

const s3 = new S3()
const todoImagesBucket = process.env.TODO_IMAGES_S3_BUCKET
const urlExpiration = Number(process.env.IMAGE_URL_EXPIRATION)

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const imageId = todoId + '_image'
  
  const signedUrl = s3.getSignedUrl('putObject', {
    Bucket: todoImagesBucket,
    Key: imageId,
    Expires: urlExpiration
  })
  
  return {
    statusCode: 201,
    headers: {},
    body: JSON.stringify({
      uploadUrl: signedUrl
    })
  }
}
