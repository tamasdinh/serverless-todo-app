import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { getTodos } from '../../businessLogic/todosLogic'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  console.log('Getting all todo items via DocumentClient.scan()', event)
  
  const ALLOWED_ORIGINS = [
    'http://localhost:3000'
  ]

  const origin = event.headers.origin
  let headers
  
  if (ALLOWED_ORIGINS.includes(origin)) {
    console.log('Origin is in allowed origins', origin)
    headers = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': true
    }
  } else {
    headers = {
      'Access-Control-Allow-Origin': '*'
    }
  }

  console.log(headers)
  const userId = getUserId(event)
  
  const response = await getTodos(userId)

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      items: response
    })
  }

}
