import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const docClient = new DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  const oldVersion = await docClient.query({
    TableName: todosTable,
    KeyConditionExpression: 'todoId = :todoId',
    ExpressionAttributeValues: {
      ':todoId': todoId
    }
  }).promise()
  
  await docClient.update({
    TableName: todosTable,
    Key: {
      todoId: todoId,
      createdAt: oldVersion.Items[0].createdAt
    },
    UpdateExpression: 'set todo = :todo, dueDate = :dueDate, done = :done',
    ExpressionAttributeValues: {
      ':todo': updatedTodo.todo,
      ':dueDate': updatedTodo.dueDate,
      ':done': updatedTodo.done
    }
  }).promise()

  const updatedItem = await docClient.query({
    TableName: todosTable,
    KeyConditionExpression: 'todoId = :todoId',
    ExpressionAttributeValues: {
      ':todoId': todoId 
    }
  }).promise()
  
  return {
    statusCode: 201,
    headers: {},
    body: JSON.stringify(updatedItem.Items[0])
  }
}
