import { todoDBAccess } from '../dataLayer/todoDBAccess'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const DB = new todoDBAccess()

export async function getTodos(userId: string): Promise<DocumentClient.AttributeMap[]> {
  return await DB.getTodos(userId)
}