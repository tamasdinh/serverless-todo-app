import { todoDBAccess } from '../dataLayer/todoDBAccess'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const DB = new todoDBAccess()
const imagesBucket = process.env.TODO_IMAGES_S3_BUCKET
const awsRegion = process.env.REGION

export async function getTodos(userId: string): Promise<DocumentClient.AttributeMap[]> {
  return await DB.getTodos(userId)
}

export async function createTodo(userId: string, newTodo): Promise<TodoItem> {

  const todoId = uuid.v4()

  const todoItem = {
    userId,
    createdAt: new Date().toISOString(),
    todoId,
    ...newTodo,
    done: false,
    attachmentUrl: `https://${imagesBucket}.s3.${awsRegion}.amazonaws.com/${todoId}`
  }

  await DB.createTodo(todoItem)

  return todoItem
}

export async function updateTodo(todoId: string, updatedTodo: UpdateTodoRequest): Promise<void> {
  return await DB.updateTodo(todoId, updatedTodo)
}