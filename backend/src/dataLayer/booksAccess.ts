import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { BookItem } from '../models/BookItem'
import { BookUpdate } from '../models/BookUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('BooksAccess')

export class BooksAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly booksTable = process.env.BOOKS_TABLE
    ){}

    async createBook(book: BookItem): Promise<BookItem> {
        logger.info("Creating new Book in " + this.booksTable)
        await this.docClient.put({
            TableName: this.booksTable,
            Item: book
        }).promise()

        return book
    }

    async removeBook(userId:string, bookId:string){        
        await this.docClient.delete({
            TableName: this.booksTable,
            Key: { 
                bookId, 
                userId }
        }).promise()
    }

    async updateBook(bookUpdate: BookUpdate, userId: string, bookId: string): Promise<BookUpdate> {
        logger.info("Updating Book with " + bookUpdate)
        await this.docClient.update({
            TableName: this.booksTable,
            Key: {
                bookId,
                userId
            },
            ExpressionAttributeNames: {"#N": "bookName", "#A": "author", "#D": "description", "#R": "read"},
            UpdateExpression: "set #N = :bookName, #A = :author, #D = :description, #R = :read",
            ExpressionAttributeValues: {
                ":bookName": bookUpdate.bookName,
                ":author": bookUpdate.author,
                ":description": bookUpdate.description,
                ":read": bookUpdate.read,
            },
        }).promise()

        return bookUpdate
    }

    async getBooksForUser(userId: string): Promise<BookItem[]> {
        
        const result = await this.docClient.query({
            TableName: this.booksTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
            ':userId': userId
        }}).promise()

        const items = result.Items
        return items as BookItem[]
    }

}