import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item

    try {
      const toDoItem = await createTodo(newTodo, getUserId(event))

      return {
        statusCode: 201,
        body: JSON.stringify({item: toDoItem})
      }
    } catch (error) {
      console.log(error)
    }
  })

  handler
  .use(
    cors({
      credentials: true
    })
  )
