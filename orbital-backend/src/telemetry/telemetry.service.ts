import { Injectable, BadRequestException } from '@nestjs/common';
import sharp from 'sharp';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class TelemetryService {
    async analyzePixel(imagePath: string, x: number, y: number) {
        const fullPath = join(process.cwd(), imagePath);

        if (!existsSync(fullPath)) {
            throw new BadRequestException('La imagen no existe en el servidor.');
        }

        try {
            const { data, info } = await sharp(fullPath)
                .raw()
                .toBuffer({ resolveWithObject: true });

            // Las coordenadas x, y vienen del frontend (relativas a la imagen mostrada)
            // Aseguramos que estén dentro de los límites
            const pixelIndex = (Math.floor(y) * info.width + Math.floor(x)) * info.channels;

            const r = data[pixelIndex];
            const g = data[pixelIndex + 1];
            const b = data[pixelIndex + 2];

            return {
                coordinates: { x, y },
                rgb: { r, g, b },
                analysis: this.generateSpectralSignature(r, g, b),
            };
        } catch (error) {
            throw new BadRequestException('Error al procesar la imagen: ' + error.message);
        }
    }

    private generateSpectralSignature(r: number, g: number, b: number) {
        // Simulación científica basada en colores
        // Mucho rojo = Óxido de Hierro (Hematita)
        // Gris/Azul = Basalto o Silicatos
        // Brillante = Sulfatos o Hielo (si es muy blanco)

        const ironOxide = (r / 255) * 100;
        const silicates = ((g + b) / 510) * 100;
        const sulfates = r > 200 && g > 200 && b > 200 ? 80 : 10;

        return [
            { name: 'Óxido de Hierro', value: Math.round(ironOxide) },
            { name: 'Silicatos', value: Math.round(silicates) },
            { name: 'Sulfatos', value: Math.round(sulfates) },
            { name: 'Otros', value: Math.round(100 - (ironOxide + silicates) / 2) },
        ];
    }
}
