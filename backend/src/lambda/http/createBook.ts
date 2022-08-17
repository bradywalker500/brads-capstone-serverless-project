import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateBookRequest } from '../../requests/CreateBookRequest'
import { getUserId } from '../utils';
import { createBook } from '../../businessLogic/books'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newBook: CreateBookRequest = JSON.parse(event.body)
    // BOOK: Implement creating a new BOOK item

    try {
      const bookItem = await createBook(newBook, getUserId(event))

      return {
        statusCode: 201,
        body: JSON.stringify({item: bookItem})
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
