"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Crosshair } from "lucide-react";

interface MarsViewerProps {
    onPointSelected: (x: number, y: number, imagePath: string) => void;
    imageUrl?: string;
    imagePath?: string;
    onUpload: (file: File) => void;
}

export const MarsViewer = ({ onPointSelected, imageUrl, imagePath, onUpload }: MarsViewerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [clickPoint, setClickPoint] = useState<{ x: number; y: number } | null>(null);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageUrl || !imagePath || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calcular coordenadas relativas al tamaño real de la imagen
        const img = containerRef.current.querySelector("img");
        if (img) {
            const scaleX = img.naturalWidth / img.width;
            const scaleY = img.naturalHeight / img.height;

            const realX = x * scaleX;
            const realY = y * scaleY;

            setClickPoint({ x, y });
            onPointSelected(realX, realY, imagePath);
        }
    };

    return (
        <div className="relative w-full aspect-video bg-zinc-900/50 rounded-2xl overflow-hidden border border-orange-500/20 shadow-2xl group transition-all duration-700 hover:border-orange-500/40">
            {!imageUrl ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-zinc-900 to-black">
                    <div className="p-8 rounded-full border-2 border-dashed border-orange-500/30 group-hover:border-orange-500/60 transition-colors">
                        <Upload className="text-orange-500 w-12 h-12 animate-bounce" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-orange-200 uppercase tracking-tighter">Preparado para Escaneo</h3>
                        <p className="text-sm text-zinc-500 mt-1">Sube una fotografía de la superficie de Marte para comenzar</p>
                    </div>
                    <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
                        accept="image/*"
                    />
                </div>
            ) : (
                <div
                    ref={containerRef}
                    className="relative w-full h-full cursor-crosshair"
                    onClick={handleClick}
                >
                    <img
                        src={imageUrl}
                        alt="Mars Surface"
                        className="w-full h-full object-cover"
                    />

                    <AnimatePresence>
                        {clickPoint && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                style={{ left: clickPoint.x, top: clickPoint.y }}
                                className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
                            >
                                <div className="relative">
                                    <div className="absolute inset-[-12px] border border-orange-500 rounded-full animate-ping opacity-75" />
                                    <Crosshair className="text-orange-500 w-6 h-6" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Grid Overlay */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                    />
                </div>
            )}
        </div>
    );
};
