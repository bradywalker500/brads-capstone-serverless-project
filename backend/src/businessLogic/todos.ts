import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

// TODO: Implement businessLogic

const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()
const logger = createLogger("todos")

export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {
    
    const todoId = uuid.v4()
    logger.info("Creating Todo")

    return await todosAccess.createTodo({
        todoId: todoId,
        userId: userId,
        createdAt: new Date().toISOString(),
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false,
        attachmentUrl: `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${todoId}`
    })
}

export async function removeTodo(userId:string, todoId:string){
    logger.info("Deleting Todo with ID " + todoId)
    await todosAccess.removeTodo(userId, todoId)
}

export async function updateTodo(updateTodoRequest: UpdateTodoRequest, userId: string, todoId: string): Promise<UpdateTodoRequest>{
    logger.info("Updating Todo with ID " + todoId)
    return await todosAccess.updateTodo(updateTodoRequest, userId, todoId)
}

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    logger.info("Retrieving Todos for userId " + userId)
    return todosAccess.getTodosForUser(userId)
}

export async function createAttachmentPresignedUrl(todoId: string){
    return await attachmentUtils.getUploadUrl(todoId);
}