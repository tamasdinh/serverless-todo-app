import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  console.log('Getting all todo items via DocumentClient.scan()', event)
  
  const response = await docClient.scan({
    TableName: todosTable
  }).promise()

  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify(response.Items)
  }

}
