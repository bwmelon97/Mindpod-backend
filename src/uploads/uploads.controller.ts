import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';

@Controller('uploads')
export class UploadsController {
    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        AWS.config.update({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        })
        try {
            const OBJECT_NAME = `${Date.now()}.${file.originalname}`
            await new AWS.S3().putObject({
                Body: file.buffer,
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: OBJECT_NAME,
                ACL: 'public-read'
            }).promise()
            const url = `https://${process.env.AWS_BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/${OBJECT_NAME}`
            return { ok: true, url }
        } catch (error) {
            return { ok: false, error }
        }
    }
}
