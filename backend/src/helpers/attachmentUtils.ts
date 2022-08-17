import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// BOOK: Implement the fileStogare logic

// const docClient = new XAWS.DynamoDB.DocumentClient()
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export class AttachmentUtils {

    async getUploadUrl(bookId: string) {
        return s3.getSignedUrl('putObject', {
          Bucket: bucketName,
          Key: bookId,
          Expires: parseInt(urlExpiration)
        })
      }
}