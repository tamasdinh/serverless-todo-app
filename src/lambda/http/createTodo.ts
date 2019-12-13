import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as uuid from 'uuid'
import { getUserId } from '../utils'

const docClient = new DocumentClient()
const todosTable = process.env.TODOS_TABLE
const imagesBucket = process.env.TODO_IMAGES_S3_BUCKET
const awsRegion = process.env.REGION

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  console.log('Posting new TODO based on event:', event.body)
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const userId = getUserId(event)
  const todoId = uuid.v4()

  const todoItem = {
    userId,
    createdAt: new Date().toISOString(),
    todoId,
    ...newTodo,
    done: false,
    attachmentUrl: `https://${imagesBucket}.s3.${awsRegion}.amazonaws.com/${todoId}`
  }

  await docClient.put({
    TableName: todosTable,
    Item: todoItem
  }).promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: {
        ...todoItem
      }
    })
  }
}
