import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { updateBook } from '../../businessLogic/books'
import { UpdateBookRequest } from '../../requests/UpdateBookRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const bookId = event.pathParameters.bookId
    const updatedBook: UpdateBookRequest = JSON.parse(event.body)
    // BOOK: Update a BOOK item with the provided id using values in the "updatedBook" object


    try {
      const userId = await getUserId(event)
      const item = await updateBook(updatedBook, userId, bookId)
      return {
        statusCode: 200,
        body: JSON.stringify({item: item})
      }} catch (error) {console.log(error)}
  })

handler
  .use(
    cors({
      credentials: true
    })
  )
