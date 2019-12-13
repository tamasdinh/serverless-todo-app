/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateTodoRequest {
  todo: string
  dueDate: string
  done: boolean
}