/**
 * Fields in a request to update a single BOOK item.
 */
export interface UpdateBookRequest {
  bookName: string
  author: string
  description: string
  read: boolean
}