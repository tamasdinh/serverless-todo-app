import { DocumentClient } from 'aws-sdk/clients/dynamodb'

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

}