import {
    Controller,
    Post,
    Delete,
    Param,
    UploadedFile,
    UseInterceptors,
    HttpCode,
    HttpStatus,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

@Controller('api')
export class UploadController {
    @Post('upload')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (_req, file, cb) => {
                    const sanitized = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
                    cb(null, sanitized);
                },
            }),
            limits: {
                fileSize: 10 * 1024 * 1024, // 10 MB
            },
        }),
    )
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        return {
            success: true,
            data: {
                filename: file.filename,
                originalname: file.originalname,
                size: file.size,
                mimetype: file.mimetype,
            },
        };
    }

    @Delete('delete/:filename')
    @HttpCode(HttpStatus.OK)
    deleteFile(@Param('filename') filename: string) {
        const sanitized = path.basename(filename);
        const filePath = path.join(process.cwd(), 'uploads', sanitized);

        if (!fs.existsSync(filePath)) {
            throw new NotFoundException(`File "${sanitized}" not found`);
        }

        fs.unlinkSync(filePath);

        return {
            success: true,
            data: {
                filename: sanitized,
                deleted: true,
            },
        };
    }
}
