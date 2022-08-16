import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { removeTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id
    
    try {
      const userId = getUserId(event);
      await removeTodo(userId, todoId)
      return {
        statusCode: 204,
        body: 'Success'
      }
    } catch (error) {
      console.log(error)
    }
  }
)

handler
  .use(
    cors({
      credentials: true
    })
  )
