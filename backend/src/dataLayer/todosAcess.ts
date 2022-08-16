import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodosAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE
    ){}

    async createTodo(todo: TodoItem): Promise<TodoItem> {
        logger.info("Creating new Todo in " + this.todosTable)
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise()

        return todo
    }

    async removeTodo(userId:string, todoId:string){        
        await this.docClient.delete({
            TableName: this.todosTable,
            Key: { 
                todoId, 
                userId }
        }).promise()
    }

    async updateTodo(todoUpdate: TodoUpdate, userId: string, todoId: string): Promise<TodoUpdate> {
        logger.info("Updating Todo with " + todoUpdate)
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            },
            ExpressionAttributeNames: {"#N": "name"},
            UpdateExpression: "set #N = :name, dueDate = :dueDate, done = :done",
            ExpressionAttributeValues: {
                ":name": todoUpdate.name,
                ":dueDate": todoUpdate.dueDate,
                ":done": todoUpdate.done,
            },
        }).promise()

        return todoUpdate
    }

    async getTodosForUser(userId: string): Promise<TodoItem[]> {
        
        const result = await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
            ':userId': userId
        }}).promise()

        const items = result.Items
        return items as TodoItem[]
    }
}