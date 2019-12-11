import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as uuid from 'uuid'

const docClient = new DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  console.log('Posting new TODO based on event:', event.body)
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  const todoItem = {
    // FIXME: correct object userId property
    userId: uuid.v4(),
    createdAt: new Date().toISOString(),
    todoId: uuid.v4(),
    ...newTodo,
    done: false,
    attachmentUrl: '<URL to be inserted>' // FIXME: URL to be added
  }

  await docClient.put({
    TableName: todosTable,
    Item: todoItem
  }).promise()

  return {
    statusCode: 201,
    headers: {},
    body: JSON.stringify(todoItem)
  }
}
