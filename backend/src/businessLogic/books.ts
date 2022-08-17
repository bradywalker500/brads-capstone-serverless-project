import { BooksAccess } from '../dataLayer/booksAccess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { BookItem } from '../models/BookItem'
import { CreateBookRequest } from '../requests/CreateBookRequest'
import { UpdateBookRequest } from '../requests/UpdateBookRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

// BOOK: Implement businessLogic

const booksAccess = new BooksAccess()
const attachmentUtils = new AttachmentUtils()
const logger = createLogger("books")

export async function createBook(
    createBookRequest: CreateBookRequest,
    userId: string
): Promise<BookItem> {
    
    const bookId = uuid.v4()
    logger.info("Creating Book")

    return await booksAccess.createBook({
        bookId: bookId,
        userId: userId,
        addedOn: new Date().toISOString(),
        bookName: createBookRequest.bookName,
        author: createBookRequest.author,
        description: createBookRequest.description,
        read: false,
        attachmentUrl: `https://${process.env.BOOK_ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${bookId}`
    })
}

export async function removeBook(userId:string, bookId:string){
    logger.info("Deleting Book with ID " + bookId)
    await booksAccess.removeBook(userId, bookId)
}

export async function updateBook(updateBookRequest: UpdateBookRequest, userId: string, bookId: string): Promise<UpdateBookRequest>{
    logger.info("Updating Book with ID " + bookId)
    return await booksAccess.updateBook(updateBookRequest, userId, bookId)
}

export async function getBooksForUser(userId: string): Promise<BookItem[]> {
    logger.info("Retrieving Books for userId " + userId)
    return booksAccess.getBooksForUser(userId)
}

export async function createAttachmentPresignedUrl(bookId: string){
    return await attachmentUtils.getUploadUrl(bookId);
}