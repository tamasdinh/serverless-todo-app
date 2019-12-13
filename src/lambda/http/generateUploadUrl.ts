import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { S3 } from 'aws-sdk'

const s3 = new S3({
  signatureVersion: 'v4'
})
const todoImagesBucket = process.env.TODO_IMAGES_S3_BUCKET
const urlExpiration = Number(process.env.IMAGE_URL_EXPIRATION)

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  
  const signedUrl = s3.getSignedUrl('putObject', {
    Bucket: todoImagesBucket,
    Key: todoId,
    Expires: urlExpiration
  })
  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: signedUrl
    })
  }
}
