import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as uuid from 'uuid'

const docClient = new DocumentClient()
const todosTable = process.env.TODOS_TABLE
const imagesBucket = process.env.TODO_IMAGES_S3_BUCKET
const awsRegion = process.env.REGION

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  console.log('Posting new TODO based on event:', event.body)
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const todoId = uuid.v4()

  const todoItem = {
    // FIXME: correct object userId property
    userId: uuid.v4(),
    createdAt: new Date().toISOString(),
    todoId,
    ...newTodo,
    done: false,
    attachmentUrl: `https://${imagesBucket}.s3.${awsRegion}.amazonaws.com/${todoId}_image`
  }

  await docClient.put({
    TableName: todosTable,
    Item: todoItem
  }).promise()

  return {
    statusCode: 201,
    headers: {},
    body: JSON.stringify({
      item: {
        ...todoItem
      }
    })
  }
}
