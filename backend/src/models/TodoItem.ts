export interface TodoItem {
  userId: string
  todoId: string
  createdAt: string
  todo: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
