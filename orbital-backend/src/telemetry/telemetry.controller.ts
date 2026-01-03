import { Controller, Post, Body, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TelemetryService } from './telemetry.service';

@Controller('telemetry')
export class TelemetryController {
    constructor(private readonly telemetryService: TelemetryService) { }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('');
                    cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        }),
    )
    uploadImage(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No se ha subido ningún archivo.');
        }
        return {
            message: 'Imagen subida correctamente',
            path: file.path,
        };
    }

    @Post('analyze')
    async analyze(@Body() body: { imagePath: string; x: number; y: number }) {
        const { imagePath, x, y } = body;
        if (!imagePath || x === undefined || y === undefined) {
            throw new BadRequestException('Faltan datos de análisis (imagePath, x, y).');
        }
        return this.telemetryService.analyzePixel(imagePath, x, y);
    }
}
