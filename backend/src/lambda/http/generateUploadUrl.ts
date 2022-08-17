import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../businessLogic/books'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const bookId = event.pathParameters.bookId
    // BOOK: Return a presigned URL to upload a file for a BOOK item with the provided id
    
    const uploadUrl = await createAttachmentPresignedUrl(bookId)
    return {
      statusCode: 201,
      body: JSON.stringify({uploadUrl})
    }
  }
)

handler
  .use(
    cors({
      credentials: true
    })
  )
