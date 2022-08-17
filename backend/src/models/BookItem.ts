export interface BookItem {
  userId: string
  bookId: string
  addedOn: string
  bookName: string
  author: string
  description: string
  read: boolean
  attachmentUrl?: string
}
