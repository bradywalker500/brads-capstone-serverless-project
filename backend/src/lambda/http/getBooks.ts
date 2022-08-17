import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getBooksForUser as getBooksForUser } from '../../businessLogic/books'
import { getUserId } from '../utils';

// BOOK: Get all BOOK items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const userId = getUserId(event)
    const books = await getBooksForUser(userId)

    return {
      statusCode: 200,
      body: JSON.stringify({items: books})
    }
})

handler
  .use(
    cors({
      credentials: true
    })
  )
