import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

export class todoDBAccess {

  constructor(
    private readonly docClient: DocumentClient = new DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly userIndex = process.env.TODOS_SECONDARY_INDEX
  ){}

  async getTodos(userId: string): Promise<DocumentClient.AttributeMap[]> {
    
    const response =  await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.userIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()
    
    return response.Items
  }

  async createTodo(todoItem: TodoItem) {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise()
  }

  async updateTodo(todoId: string, updatedTodo: UpdateTodoRequest): Promise<void> {
    
    const oldVersion = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'todoId = :todoId',
      ExpressionAttributeValues: {
        ':todoId': todoId
      }
    }).promise()
    
    await this.docClient.update({
      TableName: this.todosTable,
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

  }

  async deleteTodo(todoId: string): Promise<void> {

    const itemToDelete = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'todoId = :todoId',
      ExpressionAttributeValues: {
        ':todoId': todoId
      }
    }).promise()
   
    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        todoId,
        createdAt: itemToDelete.Items[0].createdAt
      }
    }).promise()
  }

}