import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { removeBook } from '../../businessLogic/books'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const bookId = event.pathParameters.bookId
    // BOOK: Remove a BOOK item by id
    
    try {
      const userId = getUserId(event);
      await removeBook(userId, bookId)
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
