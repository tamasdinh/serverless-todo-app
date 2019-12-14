import { S3 } from 'aws-sdk'

export class todoS3Access {

  constructor(
    private readonly s3: S3 = new S3({
      signatureVersion: 'v4'
    }),
    private readonly todoImagesBucket: string = process.env.TODO_IMAGES_S3_BUCKET,
    private readonly urlExpiration: number = Number(process.env.IMAGE_URL_EXPIRATION)
  ){}

  getSignedUrl(todoId: string): string {
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.todoImagesBucket,
      Key: todoId,
      Expires: this.urlExpiration
    })
  }
}