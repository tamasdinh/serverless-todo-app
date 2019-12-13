import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const docClient = new DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  const itemToDelete = await docClient.query({
    TableName: todosTable,
    KeyConditionExpression: 'todoId = :todoId',
    ExpressionAttributeValues: {
      ':todoId': todoId
    }
  }).promise()
 
  await docClient.delete({
    TableName: todosTable,
    Key: {
      todoId,
      createdAt: itemToDelete.Items[0].createdAt
    }
  }).promise()
  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: `Todo w/ID ${todoId} successfully deleted.`,
      todo_deleted: itemToDelete.Items[0]
    })
  }
}
